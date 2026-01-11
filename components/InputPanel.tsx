'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import VoiceInput from './VoiceInput';
import { useLanguage } from '@/contexts/LanguageContext';

interface InputPanelProps {
    onUpdate: (segment: string) => void;
    onReset: () => void;
    isProcessing: boolean;
}

export default function InputPanel({ onUpdate, onReset, isProcessing }: InputPanelProps) {
    const { t } = useLanguage();
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<'text' | 'voice'>('text');

    const handleSubmit = () => {
        if (input.trim()) {
            onUpdate(input.trim());
            setInput('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleVoiceTranscript = (text: string) => {
        onUpdate(text);
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-300 shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">{t.app.input}</h2>
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition"
                >
                    <RotateCcw className="w-4 h-4" />
                    {t.app.reset}
                </button>
            </div>

            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setMode('text')}
                    className={`flex-1 py-2 rounded-lg font-medium transition ${
                        mode === 'text'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                >
                    {t.app.textMode}
                </button>
                <button
                    onClick={() => setMode('voice')}
                    className={`flex-1 py-2 rounded-lg font-medium transition ${
                        mode === 'voice'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                >
                    {t.app.voiceMode}
                </button>
            </div>

            {mode === 'text' ? (
                <>
          <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t.app.inputPlaceholder}
              className="w-full h-40 bg-gray-50 text-gray-900 rounded-lg p-4 border border-gray-300 focus:border-indigo-600 focus:outline-none resize-none placeholder:text-gray-500"
              disabled={isProcessing}
          />

                    <button
                        onClick={handleSubmit}
                        disabled={isProcessing || !input.trim()}
                        className="mt-4 w-full py-3 bg-indigo-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? t.app.sending : t.app.send}
                    </button>
                </>
            ) : (
                <VoiceInput onTranscript={handleVoiceTranscript} isProcessing={isProcessing} />
            )}
        </div>
    );
}
