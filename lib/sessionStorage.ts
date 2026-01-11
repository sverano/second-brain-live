import { SavedSession, CognitiveState, EMPTY_STATE } from './types';

const SESSIONS_KEY = 'secondbrain-sessions';
const CURRENT_SESSION_KEY = 'secondbrain-current-session';

export function getSavedSessions(): SavedSession[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(SESSIONS_KEY);
    if (!data) return [];
    try {
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export function saveSession(session: SavedSession): void {
    if (typeof window === 'undefined') return;
    const sessions = getSavedSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);

    if (existingIndex >= 0) {
        sessions[existingIndex] = session;
    } else {
        sessions.unshift(session);
    }

    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function deleteSession(sessionId: string): void {
    if (typeof window === 'undefined') return;
    const sessions = getSavedSessions();
    const filtered = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(filtered));
}

export function getSession(sessionId: string): SavedSession | null {
    const sessions = getSavedSessions();
    return sessions.find(s => s.id === sessionId) || null;
}

export function getCurrentSessionId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(CURRENT_SESSION_KEY);
}

export function setCurrentSessionId(sessionId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CURRENT_SESSION_KEY, sessionId);
}

export function generateSessionTitle(state: CognitiveState): string {
    if (state.résumé && state.résumé.length > 0) {
        return state.résumé.substring(0, 50) + (state.résumé.length > 50 ? '...' : '');
    }
    if (state.idées_clés && state.idées_clés.length > 0) {
        return state.idées_clés[0].substring(0, 50);
    }
    return new Date().toLocaleDateString();
}

export function createNewSession(): SavedSession {
    const now = new Date().toISOString();
    return {
        id: crypto.randomUUID(),
        title: 'Nouvelle session',
        state: EMPTY_STATE,
        createdAt: now,
        updatedAt: now,
    };
}