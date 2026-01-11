'use client';

import {usePathname, useRouter} from 'next/navigation';
import {Brain, Globe} from 'lucide-react';
import {useLanguage} from '@/contexts/LanguageContext';
import ExportButton from '@/components/ExportButton';
import {CognitiveState} from '@/lib/types';

interface AppHeaderProps {
    sessionState?: CognitiveState;
    sessionId?: string | null;
}

export default function AppHeader({ sessionState, sessionId }: AppHeaderProps) {
    const { locale, setLocale, t } = useLanguage();
    const pathname = usePathname();
    const router = useRouter();

    const isSessionPage = pathname === '/session';
    const isLandingPage = pathname === '/';

    if (isSessionPage) {
        return (
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex items-center justify-between h-full">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            {t.app.back}
                        </button>

                        <div className="flex items-center gap-2">
                            <Brain className="w-8 h-8 text-indigo-600" />
                            <span className="text-xl font-bold text-gray-900">Second Brain Live</span>
                        </div>

                        <div className="flex items-center gap-4">
                            {sessionState && <ExportButton state={sessionState} sessionId={sessionId || null} />}
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

                        <nav className="flex items-center gap-6">
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

                    <button
                        onClick={() => setLocale(locale === 'en' ? 'fr' : 'en')}
                        className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition text-sm font-medium"
                    >
                        <Globe className="w-4 h-4" />
                        {locale.toUpperCase()}
                    </button>
                </div>
            </div>
        </header>
    );
}
