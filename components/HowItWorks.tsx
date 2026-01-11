'use client';

import { ArrowRight, Github, Mic, Settings, Brain, BarChart3, RefreshCw, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HowItWorks() {
    const { t } = useLanguage();

    return (
        <section className="relative py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-gray-900 mb-4">
                        {t.howItWorks.title}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        {t.howItWorks.subtitle}
                    </p>
                </div>

                <div className="max-w-5xl mx-auto mb-16">
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8 border border-indigo-200">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t.howItWorks.flow}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Mic className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">{t.howItWorks.input}</p>
                                    <p className="text-xs text-gray-600">{t.howItWorks.voiceText}</p>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <ArrowRight className="w-6 h-6 text-indigo-600" />
                            </div>

                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Settings className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">{t.howItWorks.chunking}</p>
                                    <p className="text-xs text-gray-600">{t.howItWorks.auto}</p>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <ArrowRight className="w-6 h-6 text-indigo-600" />
                            </div>

                            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg p-4 shadow-lg border-2 border-indigo-700">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Brain className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <p className="text-sm font-semibold text-white">Gemini 3</p>
                                    <p className="text-xs text-indigo-200">{t.howItWorks.reasoning}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center mt-4">
                            <ArrowRight className="w-6 h-6 text-indigo-600 rotate-90" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                <div className="text-center">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <BarChart3 className="w-5 h-5 text-green-600" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">{t.howItWorks.cognitiveState}</p>
                                    <p className="text-xs text-gray-600">{t.howItWorks.structured}</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                <div className="text-center">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <RefreshCw className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">{t.howItWorks.update}</p>
                                    <p className="text-xs text-gray-600">{t.howItWorks.incremental}</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                <div className="text-center">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Sparkles className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">{t.howItWorks.display}</p>
                                    <p className="text-xs text-gray-600">{t.app.stat3}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">{t.howItWorks.whyGemini}</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <span className="text-green-300 font-bold">✓</span>
                                <div>
                                    <p className="font-semibold">{t.howItWorks.contextualReasoning}</p>
                                    <p className="text-sm text-indigo-100">{t.howItWorks.contextualDesc}</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-300 font-bold">✓</span>
                                <div>
                                    <p className="font-semibold">{t.howItWorks.lowLatency}</p>
                                    <p className="text-sm text-indigo-100">{t.howItWorks.lowLatencyDesc}</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-300 font-bold">✓</span>
                                <div>
                                    <p className="font-semibold">{t.howItWorks.instructionFollowing}</p>
                                    <p className="text-sm text-indigo-100">{t.howItWorks.instructionDesc}</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-300 font-bold">✓</span>
                                <div>
                                    <p className="font-semibold">{t.howItWorks.multimodal}</p>
                                    <p className="text-sm text-indigo-100">{t.howItWorks.multimodalDesc}</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-300 font-bold">✓</span>
                                <div>
                                    <p className="font-semibold">{t.howItWorks.freeApi}</p>
                                    <p className="text-sm text-indigo-100">{t.howItWorks.freeApiDesc}</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gray-900 rounded-2xl p-8 text-white flex flex-col justify-center">
                        <div className="text-center">
                            <Github className="w-16 h-16 mx-auto mb-4 text-white" />
                            <h3 className="text-2xl font-bold mb-4">{t.howItWorks.openSource}</h3>
                            <p className="text-gray-300 mb-6">
                                {t.howItWorks.openSourceDesc}
                            </p>
                            <a
                                href="https://github.com/sverano/second-brain-live"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition"
                            >
                                <Github className="w-5 h-5" />
                                {t.howItWorks.viewGithub}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">{t.howItWorks.techStack}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                <p className="font-semibold text-gray-900">Next.js 14</p>
                                <p className="text-xs text-gray-600">{t.howItWorks.frontend}</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                <p className="font-semibold text-gray-900">React 19</p>
                                <p className="text-xs text-gray-600">{t.howItWorks.ui}</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                                <p className="font-semibold text-gray-900">TypeScript</p>
                                <p className="text-xs text-gray-600">{t.howItWorks.typeSafety}</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-4 shadow-sm">
                                <p className="font-semibold text-white">Gemini 3</p>
                                <p className="text-xs text-indigo-100">{t.howItWorks.ai}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
