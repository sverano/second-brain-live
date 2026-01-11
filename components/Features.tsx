'use client';

import { Brain, Lightbulb, CheckCircle, Target, HelpCircle, RefreshCw, Rocket } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Features() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Brain,
      title: t.features.feature1Title,
      description: t.features.feature1Desc,
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Lightbulb,
      title: t.features.feature2Title,
      description: t.features.feature2Desc,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: CheckCircle,
      title: t.features.feature3Title,
      description: t.features.feature3Desc,
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Target,
      title: t.features.feature4Title,
      description: t.features.feature4Desc,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: HelpCircle,
      title: t.features.feature5Title,
      description: t.features.feature5Desc,
      color: 'from-red-500 to-rose-500'
    },
    {
      icon: RefreshCw,
      title: t.features.feature6Title,
      description: t.features.feature6Desc,
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  return (
    <section id="features" className="relative py-24 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            {t.features.title} <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{t.features.titleHighlight}</span>
          </h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            {t.features.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} mb-6`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-purple-200 leading-relaxed">
                  {feature.description}
                </p>

                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-500/20 border border-purple-500/30">
            <span className="text-purple-200">{t.features.poweredBy}</span>
            <span className="font-bold text-white">Gemini 3</span>
            <Rocket className="w-5 h-5 text-purple-300" />
          </div>
        </div>
      </div>
    </section>
  );
}