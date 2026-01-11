'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Trash2, Clock, Plus, FileText, Lightbulb, CheckCircle, HelpCircle, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SavedSession } from '@/lib/types';
import { getSavedSessions, deleteSession, setCurrentSessionId } from '@/lib/sessionStorage';

export default function DashboardPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [sessions, setSessions] = useState<SavedSession[]>([]);

    const loadSessions = useCallback(() => {
        const loaded = getSavedSessions();
        // Sort by updatedAt descending
        loaded.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        setSessions(loaded);
    }, []);

    useEffect(() => {
        loadSessions();

        // Refresh when window gains focus (user comes back from session)
        const handleFocus = () => loadSessions();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [loadSessions]);

    const handleOpenSession = (session: SavedSession) => {
        setCurrentSessionId(session.id);
        router.push('/session');
    };

    const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
        e.stopPropagation();
        if (confirm(t.dashboard.confirmDelete)) {
            deleteSession(sessionId);
            loadSessions();
        }
    };

    const handleNewSession = () => {
        localStorage.removeItem('secondbrain-current-session');
        router.push('/session');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calculate global stats
    const stats = {
        totalSessions: sessions.length,
        totalIdeas: sessions.reduce((acc, s) => acc + (s.state?.idées_clés?.length || 0), 0),
        totalDecisions: sessions.reduce((acc, s) => acc + (s.state?.décisions?.length || 0), 0),
        totalActions: sessions.reduce((acc, s) => acc + (s.state?.actions_à_faire?.length || 0), 0),
        totalQuestions: sessions.reduce((acc, s) => acc + (s.state?.questions_ouvertes?.length || 0), 0),
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Brain className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-2xl font-bold text-gray-900">{t.dashboard.title}</h1>
                    </div>
                    <button
                        onClick={handleNewSession}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        {t.dashboard.newSession}
                    </button>
                </div>

                {/* Stats Cards */}
                {sessions.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm">{t.dashboard.sessions}</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center gap-2 text-amber-600 mb-1">
                                <Lightbulb className="w-4 h-4" />
                                <span className="text-sm">{t.dashboard.ideasTotal}</span>
                            </div>
                            <p className="text-2xl font-bold text-amber-600">{stats.totalIdeas}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center gap-2 text-green-600 mb-1">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm">{t.dashboard.decisionsTotal}</span>
                            </div>
                            <p className="text-2xl font-bold text-green-600">{stats.totalDecisions}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center gap-2 text-blue-600 mb-1">
                                <Target className="w-4 h-4" />
                                <span className="text-sm">{t.dashboard.actionsTotal}</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">{stats.totalActions}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center gap-2 text-purple-600 mb-1">
                                <HelpCircle className="w-4 h-4" />
                                <span className="text-sm">{t.dashboard.questionsTotal}</span>
                            </div>
                            <p className="text-2xl font-bold text-purple-600">{stats.totalQuestions}</p>
                        </div>
                    </div>
                )}

                {/* Sessions List */}
                {sessions.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">{t.dashboard.noSessions}</h2>
                        <p className="text-gray-500 mb-6">{t.dashboard.noSessionsDesc}</p>
                        <button
                            onClick={handleNewSession}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            {t.dashboard.startFirst}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">{t.dashboard.recentSessions}</h2>
                        {sessions.map((session) => (
                            <div
                                key={session.id}
                                onClick={() => handleOpenSession(session)}
                                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate mb-2">
                                            {session.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {formatDate(session.updatedAt)}
                                            </span>
                                            {session.state?.idées_clés?.length > 0 && (
                                                <span className="flex items-center gap-1 text-amber-600">
                                                    <Lightbulb className="w-4 h-4" />
                                                    {session.state.idées_clés.length}
                                                </span>
                                            )}
                                            {session.state?.décisions?.length > 0 && (
                                                <span className="flex items-center gap-1 text-green-600">
                                                    <CheckCircle className="w-4 h-4" />
                                                    {session.state.décisions.length}
                                                </span>
                                            )}
                                            {session.state?.actions_à_faire?.length > 0 && (
                                                <span className="flex items-center gap-1 text-blue-600">
                                                    <Target className="w-4 h-4" />
                                                    {session.state.actions_à_faire.length}
                                                </span>
                                            )}
                                            {session.state?.questions_ouvertes?.length > 0 && (
                                                <span className="flex items-center gap-1 text-purple-600">
                                                    <HelpCircle className="w-4 h-4" />
                                                    {session.state.questions_ouvertes.length}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteSession(e, session.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        title={t.dashboard.delete}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                                {session.state?.résumé && (
                                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                                        {session.state.résumé}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}