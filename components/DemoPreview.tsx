'use client';

import {useEffect, useState} from 'react';
import {CheckCircle, FileText, Lightbulb} from 'lucide-react';
import {useLanguage} from '@/contexts/LanguageContext';

export default function DemoPreview() {
    const { t, locale } = useLanguage();
    const [activeStep, setActiveStep] = useState(0);

    const getSteps = () => [
        {
            input: t.demo.step1,
            state: {
                résumé: locale === 'fr'
                    ? "Réunion de planification pour le lancement d'une application de fitness"
                    : "Planning meeting for fitness app launch",
                idées_clés: locale === 'fr'
                    ? ["Application de fitness", "Lancement de produit"]
                    : ["Fitness app", "Product launch"],
                décisions: [],
                actions_à_faire: [],
                questions_ouvertes: []
            }
        },
        {
            input: t.demo.step2,
            state: {
                résumé: locale === 'fr'
                    ? "Réunion de planification pour le lancement d'une app de fitness ciblant les débutants"
                    : "Planning meeting for beginner-focused fitness app launch",
                idées_clés: locale === 'fr'
                    ? ["Application de fitness", "Cibler les débutants", "Positionnement marché"]
                    : ["Fitness app", "Target beginners", "Market positioning"],
                décisions: locale === 'fr'
                    ? ["Cibler les débutants plutôt que les athlètes"]
                    : ["Target beginners rather than athletes"],
                actions_à_faire: [],
                questions_ouvertes: []
            }
        },
        {
            input: t.demo.step3,
            state: {
                résumé: locale === 'fr'
                    ? "Réunion de planification pour une app de fitness avec coach IA pour débutants"
                    : "Planning meeting for beginner fitness app with AI coach",
                idées_clés: locale === 'fr'
                    ? ["Application de fitness", "Cibler les débutants", "Coach IA intégré"]
                    : ["Fitness app", "Target beginners", "Integrated AI coach"],
                décisions: locale === 'fr'
                    ? ["Cibler les débutants plutôt que les athlètes", "Intégrer un coach IA"]
                    : ["Target beginners rather than athletes", "Integrate an AI coach"],
                actions_à_faire: [],
                questions_ouvertes: []
            }
        }
    ];

    const steps = getSteps();

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % steps.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [locale]);

    return (
        <section className="relative py-24 bg-gradient-to-b from-slate-800 to-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-white mb-4">
                        {t.demo.title} <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{t.demo.titleHighlight}</span>
                    </h2>
                    <p className="text-xl text-purple-200 max-w-2xl mx-auto">
                        {t.demo.subtitle}
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="ml-2 text-sm text-purple-200">{t.demo.input}</span>
                            </div>

                            <div className="bg-white/5 rounded-lg p-4 min-h-[200px] relative overflow-hidden">
                                <p className="text-white transition-all duration-500">
                                    {steps[activeStep].input}
                                </p>
                                <div className="absolute bottom-4 right-4">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                {steps.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                                            index === activeStep ? 'bg-purple-500' : 'bg-white/20'
                                        }`}
                                    ></div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="ml-2 text-sm text-purple-200">{t.demo.cognitiveState}</span>
                            </div>

                            <div className="space-y-3">
                                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-3 border border-blue-500/30">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 mb-1">
                                        <FileText className="w-4 h-4" />
                                        <span>{t.app.summary}</span>
                                    </div>
                                    <div className="text-sm text-white transition-all duration-500">
                                        {steps[activeStep].state.résumé}
                                    </div>
                                </div>

                                {steps[activeStep].state.idées_clés.length > 0 && (
                                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-3 border border-yellow-500/30">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-yellow-300 mb-1">
                                            <Lightbulb className="w-4 h-4" />
                                            <span>{t.app.keyIdeas}</span>
                                        </div>
                                        <div className="space-y-1">
                                            {steps[activeStep].state.idées_clés.map((idea, i) => (
                                                <div key={i} className="text-sm text-white flex items-start gap-2 transition-all duration-500">
                                                    <span className="text-yellow-400">•</span>
                                                    <span>{idea}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {steps[activeStep].state.décisions.length > 0 && (
                                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-3 border border-green-500/30">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-green-300 mb-1">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>{t.app.decisions}</span>
                                        </div>
                                        <div className="space-y-1">
                                            {steps[activeStep].state.décisions.map((decision, i) => (
                                                <div key={i} className="text-sm text-white flex items-start gap-2 transition-all duration-500">
                                                    <span className="text-green-400">•</span>
                                                    <span>{decision}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-purple-200">{t.demo.autoDemo}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
