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
    
    const prompt = `Find a word that connects "${previousWord}" and helps progress toward "${end}".

Context:
- Starting word: "${start}"
- Target word: "${end}"
- Current progress: ${currentHops.slice(0, currentStep).join(' → ')}
- Previous word: "${previousWord}"

CRITICAL REQUIREMENTS:
- The word MUST have a clear, logical connection to "${previousWord}"
- The word MUST also help bridge toward the target "${end}"
- Think of words that relate to BOTH the previous word AND the target
- Return ONLY one word
- No explanations, just the single word

Next connecting word:`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        { 
          role: 'system', 
          content: 'You are a word connection expert. Find words that connect to the previous word AND bridge toward the target. Respond with only a single word that has clear connections to both.' 
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