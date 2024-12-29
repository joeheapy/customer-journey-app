import React from 'react'
import type { JourneyStepsProps } from '@/lib/types'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  //CardContent,
} from './ui/card'

export default function JourneySteps({ steps }: JourneyStepsProps) {
  console.log('Steps data:', steps) // Add logging
  return (
    <div className="flex overflow-x-auto gap-4 py-4 px-2">
      {steps.map((step, index) => (
        <Card key={index} className="flex-shrink-0 w-[300px]">
          <CardHeader>
            <CardTitle>
              {index + 1}: {step.title}
            </CardTitle>
            <CardDescription>{step.description}</CardDescription>
          </CardHeader>
          {/* <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <p className="text-gray-600 whitespace-pre-wrap">
                  {step.description}
                </p>
              </div>
            </div>
          </CardContent> */}
        </Card>
      ))}
    </div>
  )
}
