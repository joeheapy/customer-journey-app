import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { FormData } from '@/lib/types'

// Move interface outside of the handler function
// interface JourneyRequest {
//   business_proposition: string
//   target_customers: string
//   customer_scenario: string
//   persona_name: string
// }

// Initialize OpenAI with configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3, // Add retry logic
  timeout: 30000, // 30 second timeout
})

export async function POST(request: Request) {
  try {
    // Add request timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 45000) // 45 second timeout

    // Parse request with error handling
    const requestData = await request.json().catch(() => {
      throw new Error('Invalid request format')
    })

    const {
      business_proposition,
      target_customers,
      customer_scenario,
      persona_name,
    }: FormData = requestData

    // Validate required fields
    if (
      !business_proposition ||
      !target_customers ||
      !customer_scenario ||
      !persona_name
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const input_prompt = `You are a world-class customer experience designer. Design an innovative customer journey for a ${target_customers} named ${persona_name} interested in your ${business_proposition} products and services. ${persona_name} has ${customer_scenario}. Write a narrative in 10 steps from awareness of your products and services, the customer using your service, to the customer leaving your service and ongoing customer relationship management. Make sure there are 10 steps. Name this list of narrative steps {journey_steps}.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-0613',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: input_prompt },
      ],
      max_tokens: 1000,
      temperature: 0.7, // Add temperature for consistent outputs
    })

    clearTimeout(timeoutId) // Clear timeout after successful response

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('No response from OpenAI')
    }

    // Process the response to extract numbered steps
    const journeySteps =
      response.match(/\d+\.\s*(.*?)(?=\n\d+\.|\Z)/gs)?.map((step, index) => {
        const [name, ...description] = step.trim().split(':')
        return {
          id: `step-${index + 1}`,
          title: name
            .replace(/^\d+\.\s*/, '')
            .replace(/\*/g, '')
            .trim(),
          description:
            description.join(':').replace(/\*/g, '').trim() ||
            name.replace(/\*/g, '').trim(),
        }
      }) || []

    if (journeySteps.length === 0) {
      throw new Error('Failed to parse journey steps')
    }

    return NextResponse.json(journeySteps)
  } catch (error) {
    console.error('API Error:', error)

    // More specific error responses
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: 'OpenAI API error', details: error.message },
        { status: 502 }
      )
    }

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timeout' }, { status: 504 })
    }

    return NextResponse.json(
      { error: 'Failed to generate journey' },
      { status: 500 }
    )
  }
}
