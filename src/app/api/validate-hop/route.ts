import { NextRequest, NextResponse } from "next/server";
import { openai, validateEnvironment } from "@/lib/openai";

interface ValidateHopRequest {
  previous: string;
  guess: string;
  target: string;
  isFinalStep?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    validateEnvironment();

    const body: ValidateHopRequest = await request.json();
    const { previous, guess, target, isFinalStep = false } = body;

    if (!previous || !guess || !target) {
      return NextResponse.json(
        { error: "Missing required fields: previous, guess, target" },
        { status: 400 }
      );
    }

    let prompt;

    if (isFinalStep) {
      prompt = `the guess must connect ly to the target:

FROM: "${previous.trim()}"
GUESS: "${guess.trim()}"
TARGET: "${target.trim()}"

CRITICAL: The guess "${guess.trim()}" must have a clear connection to the target word "${target.trim()}", and to the FROM word "${previous.trim()}". The connection should be obvious and strong.
And it must not be the same words.

- category relationships 
- physical/functional associations
- utilitarian connections
- Well-known pairings
- clever connections

Return a JSON response with "valid" (true/false) and "explanation" (brief reason):
{"valid": true/false, "explanation": "brief reason"}`;
    } else {
      prompt = `Word connection validation:

FROM: "${previous.trim()}"
TO: "${guess.trim()}"
ULTIMATE TARGET: "${target.trim()}"

CRITICAL: Focus ONLY on the  relationship between FROM and TO.

Valid connections include:
- category relationships 
- physical/functional associations
- utilitarian connections
- Well-known pairings
- clever connections

The guess "${guess.trim()}" must have a clear, logical relationship to "${previous.trim()}".

Return a JSON response with "valid" (true/false) and "explanation" (brief reason):
{"valid": true/false, "explanation": "brief reason"}`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            'You are a strict word connection validator. Focus on the  relationship between the two given words. Respond with JSON containing "valid" (boolean) and "explanation" (brief reason). Do not accept identical words.',
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 100,
    });

    const content = completion.choices[0].message.content?.trim();
    
    let validationResult;
    try {
      validationResult = JSON.parse(content || '{}');
    } catch {
      // Fallback for non-JSON responses
      const isValid = content?.toLowerCase().includes('yes') || content?.toLowerCase().includes('true');
      validationResult = {
        valid: isValid,
        explanation: isValid ? 'Connection accepted' : 'No clear connection found'
      };
    }

    const valid = validationResult.valid === true;
    const explanation = validationResult.explanation || 'No explanation provided';

    return NextResponse.json({
      valid,
      explanation,
      message: valid
        ? explanation
        : isFinalStep
        ? `Final step: ${explanation}`
        : explanation,
    });
  } catch (error) {
    console.error("Error validating hop:", error);

    return NextResponse.json(
      {
        error: "Failed to validate hop. Please try again.",
        valid: false,
      },
      { status: 500 }
    );
  }
}
