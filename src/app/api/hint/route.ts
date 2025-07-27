import { NextRequest, NextResponse } from 'next/server';
import { openai, validateEnvironment } from '@/lib/openai';

interface HintRequest {
  start: string;
  end: string;
  currentHops: string[];
  currentStep: number;
}

export async function POST(request: NextRequest) {
  try {
    validateEnvironment();
    
    const body: HintRequest = await request.json();
    const { start, end, currentHops, currentStep } = body;

    if (!start || !end || currentStep < 0 || currentStep >= 5) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    const previousWord = currentStep === 0 ? start : currentHops[currentStep - 1];
    
    const prompt = `Connect "${previousWord}" to "${end}" with exactly 5 intermediate words.

Context:
- Starting word: "${start}"
- Target word: "${end}"
- Current progress: ${currentHops.slice(0, currentStep).join(' → ')}
- Need next word after: "${previousWord}"

Requirements:
- Return ONLY one word
- The word should logically connect to "${previousWord}"
- The word should help progress toward "${end}"
- No explanations, just the single word

Next word:`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        { 
          role: 'system', 
          content: 'You are a helpful word game assistant. Respond with only a single word that makes a logical connection.' 
        },
        { 
          role: 'user', 
          content: prompt 
        }
      ],
      max_tokens: 10,
    });

    const content = completion.choices[0].message.content?.trim().toLowerCase();
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const hint = content.split(' ')[0].replace(/[^a-zA-Z]/g, '');

    if (!hint) {
      throw new Error('Invalid hint received');
    }

    return NextResponse.json({ hint });

  } catch (error) {
    console.error('Error generating hint:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate hint. Please try again.',
        hint: null 
      },
      { status: 500 }
    );
  }
}