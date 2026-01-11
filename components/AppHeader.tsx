'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Brain, Globe, Plus, History, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ExportButton from '@/components/ExportButton';
import { CognitiveState, SavedSession } from '@/lib/types';
import { getSavedSessions, setCurrentSessionId } from '@/lib/sessionStorage';

interface AppHeaderProps {
    sessionState?: CognitiveState;
    sessionId?: string | null;
}

export default function AppHeader({ sessionState, sessionId }: AppHeaderProps) {
    const { locale, setLocale, t } = useLanguage();
    const pathname = usePathname();
    const router = useRouter();
    const [showHistory, setShowHistory] = useState(false);
    const [sessions, setSessions] = useState<SavedSession[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isSessionPage = pathname === '/session';
    const isLandingPage = pathname === '/';
    const isDashboardPage = pathname === '/dashboard';

    useEffect(() => {
        if (showHistory) {
            setSessions(getSavedSessions().slice(0, 5));
        }
    }, [showHistory]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowHistory(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNewSession = () => {
        localStorage.removeItem('secondbrain-current-session');
        if (pathname === '/session') {
            window.location.reload();
        } else {
            router.push('/session');
        }
    };

    const handleOpenSession = (session: SavedSession) => {
        setCurrentSessionId(session.id);
        setShowHistory(false);
        if (pathname === '/session') {
            window.location.reload();
        } else {
            router.push('/session');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isSessionPage) {
        return (
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex items-center justify-between h-full">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.push('/')}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                {t.app.back}
                            </button>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors text-sm"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Brain className="w-8 h-8 text-indigo-600" />
                            <span className="text-xl font-bold text-gray-900">Second Brain Live</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleNewSession}
                                className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                {t.dashboard.newSession}
                            </button>

                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowHistory(!showHistory)}
                                    className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
                                >
                                    <History className="w-4 h-4" />
                                    {t.dashboard.history}
                                    <ChevronDown className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
                                </button>

                                {showHistory && (
                                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        {sessions.length === 0 ? (
                                            <p className="px-4 py-3 text-sm text-gray-500">{t.dashboard.noSessions}</p>
                                        ) : (
                                            <>
                                                {sessions.map((session) => (
                                                    <button
                                                        key={session.id}
                                                        onClick={() => handleOpenSession(session)}
                                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                                                    >
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {session.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatDate(session.updatedAt)}
                                                        </p>
                                                    </button>
                                                ))}
                                                <div className="border-t border-gray-100 mt-2 pt-2">
                                                    <button
                                                        onClick={() => {
                                                            setShowHistory(false);
                                                            router.push('/dashboard');
                                                        }}
                                                        className="w-full px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 text-left transition-colors"
                                                    >
                                                        {t.dashboard.title} →
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {sessionState && <ExportButton state={sessionState} sessionId={sessionId || null} />}

                            <button
                                onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
                                className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-indigo-600 transition text-sm font-medium"
                            >
                                <Globe className="w-4 h-4" />
                                {locale.toUpperCase()}
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    if (isLandingPage) {
        return (
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex items-center justify-between h-full">
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="flex items-center gap-2 hover:opacity-80 transition"
                        >
                            <Brain className="w-8 h-8 text-indigo-600" />
                            <span className="text-xl font-bold text-gray-900">Second Brain Live</span>
                        </button>

                        <nav className="flex items-center gap-4">
                            <a href="/dashboard" className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition text-sm font-medium">
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </a>
                            <a href="/features" className="text-gray-600 hover:text-indigo-600 transition text-sm font-medium">
                                {t.nav.features}
                            </a>
                            <a href="/demo" className="text-gray-600 hover:text-indigo-600 transition text-sm font-medium">
                                {t.nav.demo}
                            </a>
                            <a href="/how-it-works" className="text-gray-600 hover:text-indigo-600 transition text-sm font-medium">
                                {t.nav.howItWorks}
                            </a>
                            <a href="/about" className="text-gray-600 hover:text-indigo-600 transition text-sm font-medium">
                                {t.nav.about}
                            </a>
                            <button
                                onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
                                className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition text-sm font-medium"
                            >
                                <Globe className="w-4 h-4" />
                                {locale.toUpperCase()}
                            </button>
                        </nav>
                    </div>
                </div>
            </header>
        );
    }

    // Dashboard page and other pages
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center justify-between h-full">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 hover:opacity-80 transition"
                    >
                        <Brain className="w-8 h-8 text-indigo-600" />
                        <span className="text-xl font-bold text-gray-900">Second Brain Live</span>
                    </button>

                    <div className="flex items-center gap-3">
                        {!isDashboardPage && (
                            <a href="/dashboard" className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition text-sm font-medium">
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </a>
                        )}
                        <button
                            onClick={handleNewSession}
                            className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            {t.dashboard.newSession}
                        </button>
                        <button
                            onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
                            className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition text-sm font-medium"
                        >
                            <Globe className="w-4 h-4" />
                            {locale.toUpperCase()}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}