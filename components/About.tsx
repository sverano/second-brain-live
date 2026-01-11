'use client';

import { Brain, Zap, Target, Users, Award, Rocket } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  return (
    <section className="relative py-24 bg-gradient-to-b from-black via-indigo-950 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            {t.about.title}
          </h2>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
            {t.about.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl p-8 border border-indigo-500/30 backdrop-blur-sm">
            <Brain className="w-16 h-16 text-indigo-400 mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">{t.about.vision}</h3>
            <p className="text-indigo-100 text-lg leading-relaxed">
              {t.about.visionText}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-2xl p-8 border border-purple-500/30 backdrop-blur-sm">
            <Rocket className="w-16 h-16 text-purple-400 mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">{t.about.mission}</h3>
            <p className="text-purple-100 text-lg leading-relaxed">
              {t.about.missionText}
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12">{t.about.values}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{t.about.realtime}</h4>
              <p className="text-indigo-200">
                {t.about.realtimeDesc}
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{t.about.precision}</h4>
              <p className="text-indigo-200">
                {t.about.precisionDesc}
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{t.about.accessibility}</h4>
              <p className="text-indigo-200">
                {t.about.accessibilityDesc}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center">
          <Award className="w-16 h-16 text-white mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-white mb-4">{t.about.hackathon}</h3>
          <p className="text-indigo-100 text-lg max-w-3xl mx-auto mb-6">
            {t.about.hackathonDesc}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-white">
            <div className="bg-white/20 rounded-lg px-6 py-3 backdrop-blur-sm">
              <p className="text-sm font-semibold">Next.js 14</p>
            </div>
            <div className="bg-white/20 rounded-lg px-6 py-3 backdrop-blur-sm">
              <p className="text-sm font-semibold">Gemini 3</p>
            </div>
            <div className="bg-white/20 rounded-lg px-6 py-3 backdrop-blur-sm">
              <p className="text-sm font-semibold">TypeScript</p>
            </div>
            <div className="bg-white/20 rounded-lg px-6 py-3 backdrop-blur-sm">
              <p className="text-sm font-semibold">Web Speech API</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}