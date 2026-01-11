'use client';

import { CognitiveState } from '@/lib/types';
import { FileText, Lightbulb, CheckCircle, Target, HelpCircle, Zap } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StateDisplayProps {
    state: CognitiveState;
    isProcessing: boolean;
}

export default function StateDisplay({ state, isProcessing }: StateDisplayProps) {
    const { t } = useLanguage();

    const sections: Array<{
        key: string;
        label: string;
        icon: LucideIcon;
        bgColor: string;
        iconColor: string;
    }> = [
        { key: 'résumé', label: t.app.summary, icon: FileText, bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
        { key: 'idées_clés', label: t.app.keyIdeas, icon: Lightbulb, bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600' },
        { key: 'décisions', label: t.app.decisions, icon: CheckCircle, bgColor: 'bg-green-50', iconColor: 'text-green-600' },
        { key: 'actions_à_faire', label: t.app.actions, icon: Target, bgColor: 'bg-purple-50', iconColor: 'text-indigo-600' },
        { key: 'questions_ouvertes', label: t.app.questions, icon: HelpCircle, bgColor: 'bg-red-50', iconColor: 'text-red-600' }
    ];

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                {t.app.cognitiveState}
                {isProcessing && (
                    <span className="animate-pulse text-sm text-indigo-600 flex items-center gap-1">
            <Zap className="w-4 h-4" />
                        {t.app.processing}
          </span>
                )}
            </h2>

            <div className="space-y-4">
                {sections.map(({ key, label, icon: Icon, bgColor, iconColor }) => {
                    const value = state[key as keyof CognitiveState];
                    const isEmpty = Array.isArray(value) ? value.length === 0 : !value;

                    return (
                        <div key={key} className={`${bgColor} rounded-lg p-4 border border-gray-200 transition-all duration-300`}>
                            <div className="flex items-center gap-2 mb-2">
                                <Icon className={`w-5 h-5 ${iconColor}`} />
                                <span className="font-semibold text-gray-900">{label}</span>
                            </div>

                            {isEmpty ? (
                                <p className="text-gray-500 italic text-sm">{t.app.noInfo}</p>
                            ) : Array.isArray(value) ? (
                                <ul className="space-y-2">
                                    {value.map((item, i) => (
                                        <li key={i} className="text-gray-900 flex items-start gap-2">
                                            <span className={iconColor}>•</span>
                                            <span>{typeof item === 'object' ? JSON.stringify(item) : item}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-900">{typeof value === 'object' ? JSON.stringify(value) : value}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
