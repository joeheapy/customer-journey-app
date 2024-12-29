'use client'

import CustomerJourneyForm from '@/components/CustomerJourneyForm'
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

  const generateJourney = async (formData: FormData): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to generate journey')
      }

      const data: JourneyStep[] = await response.json()
      console.log('API Response:', data) // Add logging
      setJourneySteps(data)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(
          'An error occurred while generating the journey. Please try again.'
        )
      }
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
        <CustomerJourneyForm onSubmit={generateJourney} isLoading={isLoading} />
        {journeySteps.length > 0 && (
          <>
            <div className="flex justify-center max-w-2xl mx-auto">
              <CsvDownloadButton journeySteps={journeySteps} />
            </div>
            <JourneySteps steps={journeySteps} />
          </>
        )}
      </div>
    </div>
  )
}
