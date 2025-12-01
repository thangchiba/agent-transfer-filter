import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { messages, systemPrompt, model, apiKey } = await request.json();

    // Use environment variable if user enters "doptest" or no API key provided
    let actualApiKey = apiKey;
    if (!apiKey || apiKey === 'doptest') {
      actualApiKey = process.env.OPENAI_API_KEY;
    }

    if (!actualApiKey) {
      return NextResponse.json(
        { error: 'API key is required. Enter your key or "doptest" to use server key.' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: actualApiKey,
    });

    const chatMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages,
    ];

    const completion = await openai.chat.completions.create({
      model: model || 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: chatMessages,
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error('No response content');
    }

    const parsedResponse = JSON.parse(responseContent);

    // Validate the response structure
    if (!parsedResponse.mark || !parsedResponse.action || !parsedResponse.reply) {
      throw new Error('Invalid response structure');
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error('Chat API error:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          mark: 'COLD',
          action: 'none',
          reply: 'エラーが発生しました。もう一度お試しください。',
          error: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        mark: 'COLD',
        action: 'none',
        reply: 'エラーが発生しました。もう一度お試しください。'
      },
      { status: 500 }
    );
  }
}
