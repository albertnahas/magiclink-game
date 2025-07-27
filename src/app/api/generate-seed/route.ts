import { NextRequest, NextResponse } from 'next/server';
import { openai, validateEnvironment } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    validateEnvironment();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.8,
      messages: [
        { 
          role: 'system', 
          content: 'You are a word game generator. Generate two English words that can be connected through logical steps but are not obviously related. Respond with only a JSON object containing "start" and "end" properties.' 
        },
        { 
          role: 'user', 
          content: 'Generate two words for a word connection game. They should be moderately challenging to connect - not too easy, not impossible. Return as JSON: {"start": "word1", "end": "word2"}' 
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