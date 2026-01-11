'use client';

import {Brain, Globe} from 'lucide-react';
import {useLanguage} from '@/contexts/LanguageContext';

interface HeaderProps {
    onLogoClick?: () => void;
}

export default function Header({ onLogoClick }: HeaderProps) {
    const { locale, setLocale, t } = useLanguage();

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 h-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center justify-between h-full">
                    <button
                        onClick={onLogoClick}
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
