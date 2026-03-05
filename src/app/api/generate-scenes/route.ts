import { NextResponse } from 'next/server'
import { z } from 'zod'
import Groq from 'groq-sdk'

const RequestSchema = z.object({
    prompt: z.string().min(1),
})

export async function POST(req: Request) {
    const apiKey = process.env.GROQ_API_KEY
    const groq = apiKey ? new Groq({ apiKey }) : null

    try {
        const body = await req.json()
        const { prompt } = RequestSchema.parse(body)

        if (!groq) {
            console.error('GROQ_API_KEY is not set')
            return NextResponse.json(
                { error: 'Server configuration error: GROQ_API_KEY is missing' },
                { status: 500 }
            )
        }

        const systemPrompt = `
      You are a video scene generator. Convert the user's description into a sequence of scenes for a social media video.
      Return strictly a JSON array of objects. Do not wrap the JSON in markdown code blocks.
      JSON Schema:
      [
        {
          "text": "short text overlay (max 5 words)",
          "duration": number (seconds, between 2 and 5),
          "color": "hex color code (valid 6-digit hex)",
          "icon": "A Material UI Icon name (e.g., RocketLaunch, Restaurant)",
          "animationStyle": "A JS animation type: 'particles', 'waves', 'gradient-pulse', 'rings', or 'floating-cubes'"
        }
      ]
      - animationStyle must be one of the specified types.
      - icon must be a professional icon name in PascalCase.
      Prefer colors that match the mood of the video scenes.
      Return ONLY the raw JSON array.
    `

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
            ],
            model: 'llama-3.3-70b-versatile',
        })

        let responseText = chatCompletion.choices[0]?.message?.content || '[]'

        // Strip markdown code blocks if present
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim()

        try {
            const data = JSON.parse(responseText)
            let scenes = []
            if (Array.isArray(data)) {
                scenes = data
            } else {
                // If it's an object, find the first array property
                const arrayKey = Object.keys(data).find(key => Array.isArray(data[key]))
                if (arrayKey) {
                    scenes = data[arrayKey]
                }
            }
            return NextResponse.json({ scenes })
        } catch {
            console.error('Failed to parse Groq response:', responseText)
            return NextResponse.json(
                { error: 'Failed to generate valid scenes' },
                { status: 500 }
            )
        }

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('API Error Details:', {
            error,
            message: errorMessage,
        })
        return NextResponse.json(
            { error: errorMessage },
            { status: 400 }
        )
    }
}
