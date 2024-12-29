import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    interface JourneyRequest {
      business_proposition: string
      target_customers: string
      customer_scenario: string
      persona_name: string
    }

    // In your POST handler:
    const {
      business_proposition,
      target_customers,
      customer_scenario,
      persona_name,
    }: JourneyRequest = await request.json()

    const input_prompt = `You are a world-class customer experience designer. Design an innovative customer journey for a ${target_customers} named ${persona_name} interested in your ${business_proposition} products and services. ${persona_name} has ${customer_scenario}. Write a narrative in steps from awareness of your products and services, the customer using your service, to the customer leaving your service and ongoing customer relationship management. Name this list of narrative steps {journey_steps}.`

    const completion = await openai.chat.completions.create(
      {
        model: 'gpt-4-0613',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: input_prompt },
        ],
        max_tokens: 1000,
      },
      {
        timeout: 50000, // 50 seconds in milliseconds
      }
    )

    const response = completion.choices[0].message.content

    // Process the response to extract numbered steps
    const journeySteps = response
      ? response.match(/\d+\.\s*(.*?)(?=\n\d+\.|\Z)/gs)?.map((step, index) => {
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
      : []

    return NextResponse.json(journeySteps)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate journey' },
      { status: 500 }
    )
  }
}

// // Process the response to extract numbered steps
// const journeySteps = response
//   ? response.match(/\d+\.\s*(.*?)(?=\n\d+\.|\Z)/gs)?.map((step, index) => {
//       const [name, ...description] = step.trim().split(':')
//       return {
//         id: `step-${index + 1}`,
//         title: name.replace(/^\d+\.\s*/, '').trim(),
//         description: description.join(':').trim() || name.trim(), // Fallback if no description
//       }
//     }) || []
//   : []
