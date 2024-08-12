import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { zodFunction } from 'openai/helpers/zod';

const SlideContent = z.object({
  title: z.string(),
  content: z.array(z.string()),
});

const PresentationStructure = z.object({
  title: z.string(),
  slides: z.array(SlideContent),
});

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new NextResponse(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const completion = await client.beta.chat.completions.parse({
      model: 'gpt-4-0824',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates PowerPoint presentations by calling the createPresentation function.'
        },
        { role: 'user', content: `Help me format the following content into a well formatted PowerPoint presentation: ${prompt}` }
      ],
      tools: [zodFunction({ name: 'createPresentation', parameters: PresentationStructure })],
    });

    const toolCall = completion.choices[0].message.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== 'createPresentation') {
      throw new Error('Unexpected response from OpenAI API');
    }

    const presentationData = toolCall.function.parsed_arguments;

    return new NextResponse(JSON.stringify(presentationData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error generating presentation:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to generate presentation' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}