import {CognitiveState, EMPTY_STATE} from './types';

const sessions = new Map<string, CognitiveState>();

export function createSession(sessionId: string): CognitiveState {
    sessions.set(sessionId, { ...EMPTY_STATE });
    return sessions.get(sessionId)!;
}

export function getSession(sessionId: string): CognitiveState | null {
    return sessions.get(sessionId) || null;
}

export function updateSession(sessionId: string, state: CognitiveState): void {
    sessions.set(sessionId, state);
}

export function deleteSession(sessionId: string): void {
    sessions.delete(sessionId);
}
