'use client';

import {Download} from 'lucide-react';
import {CognitiveState} from '@/lib/types';
import {useLanguage} from '@/contexts/LanguageContext';

interface ExportButtonProps {
    state: CognitiveState;
    sessionId: string | null;
}

export default function ExportButton({ state, sessionId }: ExportButtonProps) {
    const { t } = useLanguage();

    const handleExportJSON = () => {
        const dataStr = JSON.stringify(state, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `session-${sessionId || 'export'}-${Date.now()}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    return (
        <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
        >
            <Download className="w-4 h-4" />
            {t.app.export}
        </button>
    );
}
