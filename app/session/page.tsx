'use client';

import {useEffect, useState, useRef} from 'react';
import {Brain} from 'lucide-react';
import InputPanel from '@/components/InputPanel';
import StateDisplay from '@/components/StateDisplay';
import {useLanguage} from '@/contexts/LanguageContext';
import {useSession} from '@/contexts/SessionContext';
import {
    getCurrentSessionId,
    setCurrentSessionId,
    getSession,
    saveSession,
    generateSessionTitle,
    createNewSession
} from '@/lib/sessionStorage';
import {EMPTY_STATE} from '@/lib/types';

export default function SessionPage() {
    const { t } = useLanguage();
    const { sessionId, state, setSessionId, setState } = useSession();
    const [isProcessing, setIsProcessing] = useState(false);
    const initializedRef = useRef(false);

    // Load existing session or create new one on mount
    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;

        const savedSessionId = getCurrentSessionId();

        if (savedSessionId) {
            const savedSession = getSession(savedSessionId);
            if (savedSession) {
                setSessionId(savedSession.id);
                setState(savedSession.state);
                return;
            }
        }

        // Create new session
        handleNewSession();
    }, []);

    // Auto-save session when state changes
    useEffect(() => {
        if (!sessionId || !state) return;

        // Don't save empty sessions
        const hasContent = state.résumé ||
            state.idées_clés.length > 0 ||
            state.décisions.length > 0 ||
            state.actions_à_faire.length > 0 ||
            state.questions_ouvertes.length > 0;

        if (!hasContent) return;

        const now = new Date().toISOString();
        saveSession({
            id: sessionId,
            title: generateSessionTitle(state),
            state: state,
            createdAt: getSession(sessionId)?.createdAt || now,
            updatedAt: now,
        });
    }, [sessionId, state]);

    const handleNewSession = async () => {
        const response = await fetch('/api/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId })
        });

        const data = await response.json();
        setSessionId(data.sessionId);
        setState(data.state);
        setCurrentSessionId(data.sessionId);
    };

    const handleUpdate = async (segment: string) => {
        if (!sessionId) {
            await handleNewSession();
            return;
        }

        setIsProcessing(true);

        try {
            const response = await fetch('/api/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, segment })
            });

            const data = await response.json();

            if (data.success) {
                setState(data.state);
            }
        } catch (error) {
            console.error('Update failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-3">
                        <Brain className="w-12 h-12 text-indigo-600" />
                        {t.app.title}
                    </h1>
                    <p className="text-indigo-700 font-medium">
                        {t.app.subtitle}
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <InputPanel
                        onUpdate={handleUpdate}
                        onReset={handleNewSession}
                        isProcessing={isProcessing}
                    />
                    <StateDisplay
                        state={state}
                        isProcessing={isProcessing}
                    />
                </div>
            </div>
        </main>
    );
}