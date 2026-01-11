import { NextRequest, NextResponse } from 'next/server';
import { createSession, deleteSession } from '@/lib/state';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    // Supprimer l'ancienne session si elle existe
    if (sessionId) {
      deleteSession(sessionId);
    }

    // Créer nouvelle session
    const newSessionId = uuidv4();
    const state = createSession(newSessionId);

    return NextResponse.json({
      success: true,
      sessionId: newSessionId,
      state
    });

  } catch (error) {
    console.error("Reset error:", error);
    return NextResponse.json(
      { success: false, error: "Reset failed" },
      { status: 500 }
    );
  }
}