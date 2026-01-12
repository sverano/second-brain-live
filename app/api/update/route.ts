import {NextRequest, NextResponse} from 'next/server';
import {updateCognitiveState} from '@/lib/gemini';
import {getSession, updateSession, createSession} from '@/lib/state';
import {UpdateResponse, CognitiveState, EMPTY_STATE} from '@/lib/types';

interface UpdateRequestBody {
    sessionId: string;
    segment: string;
    currentState?: CognitiveState;
    locale?: 'en' | 'fr';
}

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        const body: UpdateRequestBody = await request.json();
        const { sessionId, segment, currentState: clientState, locale = 'en' } = body;

        if (!sessionId || !segment) {
            return NextResponse.json(
                { success: false, error: "Missing sessionId or segment" },
                { status: 400 }
            );
        }

        let currentState = getSession(sessionId);

        // Session doesn't exist in backend - create it with client state or empty
        if (!currentState) {
            if (clientState) {
                updateSession(sessionId, clientState);
                currentState = clientState;
            } else {
                currentState = createSession(sessionId);
            }
        }

        const updatedState = await updateCognitiveState(currentState, segment, locale);
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
