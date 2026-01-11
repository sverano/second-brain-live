'use client';

import {createContext, ReactNode, useContext, useState} from 'react';
import {CognitiveState, EMPTY_STATE} from '@/lib/types';

interface SessionContextType {
    sessionId: string | null;
    state: CognitiveState;
    setSessionId: (id: string | null) => void;
    setState: (state: CognitiveState) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [state, setState] = useState<CognitiveState>(EMPTY_STATE);

    return (
        <SessionContext.Provider value={{ sessionId, state, setSessionId, setState }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within SessionProvider');
    }
    return context;
}
