'use client';

import { Zap, Lock, Rocket, Brain, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CTASectionProps {
  onStart: () => void;
}

export default function CTASection({ onStart }: CTASectionProps) {
  const { t } = useLanguage();

  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-1">
          <div className="bg-slate-900 rounded-3xl p-12 sm:p-16 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              {t.cta.title1}{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {t.cta.titleHighlight}
              </span>
              ?
            </h2>

            <p className="text-xl text-purple-200 mb-10 max-w-2xl mx-auto">
              {t.cta.subtitle}
            </p>

            <button
              onClick={onStart}
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-full font-bold text-xl shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105"
            >
              <span>{t.cta.cta}</span>
              <svg
                className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-sm text-white">{t.cta.badge1}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                <Lock className="w-5 h-5 text-green-400" />
                <span className="text-sm text-white">{t.cta.badge2}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                <Rocket className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-white">{t.cta.badge3}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
