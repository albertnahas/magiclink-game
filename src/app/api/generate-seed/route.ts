import { NextRequest, NextResponse } from 'next/server';
import { openai, validateEnvironment } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    validateEnvironment();

    const body = await request.json().catch(() => ({}));
    const seedWord = body.seedWord?.trim()?.toLowerCase();
    const level = body.level || 1;

    // Define difficulty levels
    const getDifficultyPrompt = (level: number) => {
      switch(level) {
        case 1:
          return 'somewhat easy to connect but not immediately obvious, requiring a bit of thought';
        case 2:
          return 'moderately difficult to connect, requiring non-obvious logical relationships';
        case 3:
          return 'challenging to connect, requiring creative and lateral thinking';
        case 4:
          return 'very challenging to connect, with obscure or indirect relationships';
        case 5:
          return 'extremely challenging to connect, with highly abstract or tenuous relationships';
        case 6:
          return 'nearly impossible to connect, with words that are maximally unrelated and require extreme creativity';
        default:
          return 'challenging to connect, requiring creative thinking';
      }
    };

    let userPrompt = `Generate two random words for a word connection game at difficulty level ${level}. They should be ${getDifficultyPrompt(level)}. Return as JSON: {"start": "word1", "end": "word2"}`;
    
    if (seedWord) {
      userPrompt = `Generate a word connection game using "${seedWord}" as one of the words at difficulty level ${level}. Create another word that is ${getDifficultyPrompt(level)} to connect to "${seedWord}". Choose whether to use "${seedWord}" as the start or end word. Return as JSON: {"start": "word1", "end": "word2"}`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 1,
      messages: [
        { 
          role: 'system', 
          content: 'You are a word game generator. Generate two English words that can be connected through logical steps but are not obviously related. Respond with only a JSON object containing "start" and "end" properties.' 
        },
        { 
          role: 'user', 
          content: userPrompt
        }
      ],
      max_tokens: 50,
    });

    const content = completion.choices[0].message.content?.trim();
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    let result;
    try {
      result = JSON.parse(content);
    } catch {
      // Fallback if parsing fails
      result = { start: 'cat', end: 'ocean' };
    }

    if (!result.start || !result.end) {
      throw new Error('Invalid response format');
    }

    return NextResponse.json({
      start: result.start.toLowerCase(),
      end: result.end.toLowerCase(),
    });

  } catch (error) {
    console.error('Error generating seed words:', error);
    
    // Fallback word pairs if API fails
    const fallbackPairs = [
      { start: 'apple', end: 'computer' },
      { start: 'book', end: 'airplane' },
      { start: 'coffee', end: 'mountain' },
      { start: 'music', end: 'telescope' },
      { start: 'garden', end: 'lightning' },
    ];
    
    const randomPair = fallbackPairs[Math.floor(Math.random() * fallbackPairs.length)];
    
    return NextResponse.json(randomPair);
  }
}