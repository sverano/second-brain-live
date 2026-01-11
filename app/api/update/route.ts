import { NextRequest, NextResponse } from 'next/server';
import { updateCognitiveState } from '@/lib/gemini';
import { getSession, updateSession } from '@/lib/state';
import { UpdateRequest, UpdateResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body: UpdateRequest = await request.json();
    const { sessionId, segment } = body;

    if (!sessionId || !segment) {
      return NextResponse.json(
        { success: false, error: "Missing sessionId or segment" },
        { status: 400 }
      );
    }

    const currentState = getSession(sessionId);

    if (!currentState) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }

    const updatedState = await updateCognitiveState(currentState, segment);
    updateSession(sessionId, updatedState);

    const processingTime = Date.now() - startTime;

    const response: UpdateResponse = {
      success: true,
      state: updatedState,
      processingTime
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { success: false, error: "Processing failed" },
      { status: 500 }
    );
  }
}