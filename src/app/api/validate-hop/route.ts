import { NextRequest, NextResponse } from 'next/server';
import { openai, validateEnvironment } from '@/lib/openai';

interface ValidateHopRequest {
  previous: string;
  guess: string;
  target: string;
}

export async function POST(request: NextRequest) {
  try {
    validateEnvironment();
    
    const body: ValidateHopRequest = await request.json();
    const { previous, guess, target } = body;

    if (!previous || !guess || !target) {
      return NextResponse.json(
        { error: 'Missing required fields: previous, guess, target' },
        { status: 400 }
      );
    }

    const prompt = `Word connection validation:

FROM: "${previous.trim()}"
TO: "${guess.trim()}"
ULTIMATE TARGET: "${target.trim()}"

CRITICAL: Focus ONLY on the direct relationship between FROM and TO.

Valid connections include:
- Synonyms or related meanings
- Category relationships (cat → animal)
- Physical associations (fire → heat)
- Functional connections (key → lock)
- Common pairings (salt → pepper)

The guess "${guess.trim()}" must have a clear, logical relationship to "${previous.trim()}".

Answer exactly "yes" or "no" only.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      messages: [
        { 
          role: 'system', 
          content: 'You are a strict word connection validator. Focus on the direct relationship between the two given words. And if the guess has a connection to the target word, do not accept the same words, respond with only "yes" or "no".' 
        },
        { 
          role: 'user', 
          content: prompt 
        }
      ],
      max_tokens: 10,
    });

    const content = completion.choices[0].message.content?.trim().toLowerCase();
    const valid = content === 'yes';

    return NextResponse.json({
      valid,
      message: valid 
        ? undefined 
        : `"${guess.trim()}" doesn't have a clear connection to "${previous.trim()}". Try a word more directly related!`
    });

  } catch (error) {
    console.error('Error validating hop:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to validate hop. Please try again.',
        valid: false 
      },
      { status: 500 }
    );
  }
}