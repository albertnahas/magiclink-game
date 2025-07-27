import { NextRequest, NextResponse } from 'next/server';
import { openai, validateEnvironment } from '@/lib/openai';

interface SolveRequest {
  start: string;
  end: string;
  steps?: number;
}

export async function POST(request: NextRequest) {
  try {
    validateEnvironment();
    
    const body: SolveRequest = await request.json();
    const { start, end, steps = 6 } = body;

    if (!start || !end) {
      return NextResponse.json(
        { error: 'Missing required fields: start, end' },
        { status: 400 }
      );
    }

    const prompt = `Connect "${start}" to "${end}" with exactly ${steps} intermediate words.

CRITICAL REQUIREMENTS:
- Return ONLY a JSON array with exactly ${steps} strings
- No explanations, no markdown, no extra text
- Each word should logically connect to the next
- The final word (step ${steps}) MUST have a DIRECT, clear connection to the target "${end}"
- The final connection should be obvious and strong (synonyms, strong category relationships, clear associations, well-known pairings)

Format: ${JSON.stringify(Array.from({length: steps}, (_, i) => `word${i+1}`))}

Connection path from "${start}" to "${end}":`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        { 
          role: 'system', 
          content: `You are a word connection expert. Respond ONLY with valid JSON arrays of exactly ${steps} words. No explanations or markdown. Ensure the final word has a DIRECT, obvious connection to the target word.` 
        },
        { 
          role: 'user', 
          content: prompt 
        }
      ],
      max_tokens: 200,
    });

    const content = completion.choices[0].message.content?.trim();
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    let cleanContent = content;
    if (content.startsWith('```json')) {
      cleanContent = content.replace(/```json\n?/, '').replace(/\n?```$/, '').trim();
    } else if (content.startsWith('```')) {
      cleanContent = content.replace(/```\n?/, '').replace(/\n?```$/, '').trim();
    }

    let chain: string[];
    try {
      chain = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw content:', content);
      console.error('Cleaned content:', cleanContent);
      throw new Error(`Invalid JSON response from OpenAI: ${content}`);
    }

    if (!Array.isArray(chain)) {
      console.error('Chain is not an array:', typeof chain, chain);
      throw new Error(`Chain must be an array, got ${typeof chain}`);
    }

    if (chain.length !== steps) {
      console.error(`Chain has wrong length: ${chain.length}, expected ${steps}. Chain:`, chain);
      
      if (chain.length > steps) {
        chain = chain.slice(0, steps);
        console.log(`Truncated chain to first ${steps} elements:`, chain);
      } else if (chain.length < steps) {
        while (chain.length < steps) {
          chain.push(`step${chain.length + 1}`);
        }
        console.log(`Padded chain to ${steps} elements:`, chain);
      }
    }

    if (!chain.every(step => typeof step === 'string' && step.trim().length > 0)) {
      throw new Error('All steps must be non-empty strings');
    }

    const processedChain = chain.map(step => step.trim().toLowerCase());

    return NextResponse.json({ chain: processedChain });

  } catch (error) {
    console.error('Error generating solution:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate solution. Please try again.',
        chain: null 
      },
      { status: 500 }
    );
  }
}