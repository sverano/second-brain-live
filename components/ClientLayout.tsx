'use client';

import {ReactNode} from 'react';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import {useSession} from '@/contexts/SessionContext';

export default function ClientLayout({ children }: { children: ReactNode }) {
    const { sessionId, state } = useSession();

    return (
        <>
            <AppHeader sessionState={state} sessionId={sessionId} />
            {children}
            <AppFooter />
        </>
    );
}
