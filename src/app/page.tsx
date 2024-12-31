'use client'

import Form from '@/components/Form'
import JourneySteps from '@/components/JourneySteps'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useState } from 'react'
import type { FormData } from '../lib/types'
import type { JourneyStep } from '../lib/types'
import CsvDownloadButton from '@/components/CsvDownloadButton'

export default function Home() {
  const [journeySteps, setJourneySteps] = useState<JourneyStep[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleJourneyUpdate = (updatedSteps: JourneyStep[]): void => {
    setJourneySteps(updatedSteps)
  }

  const generateJourney = async (formData: FormData): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 50000)

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData || 'Failed to generate journey')
      }

      const data: JourneyStep[] = await response.json()
      setJourneySteps(data)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'An error occurred while generating the journey. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {error && (
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Form onSubmit={generateJourney} isLoading={isLoading} />
        {journeySteps.length > 0 && (
          <>
            <JourneySteps steps={journeySteps} onUpdate={handleJourneyUpdate} />
            <div className="flex justify-center mt-4 max-w-2xl mx-auto">
              <CsvDownloadButton journeySteps={journeySteps} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
