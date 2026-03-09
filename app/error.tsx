'use client';

import { useEffect } from 'react';

type ErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error('App route error boundary caught an error:', error);
    }, [error]);

    return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
            <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
                <h1 style={{ marginBottom: 8 }}>Something went wrong</h1>
                <p style={{ marginBottom: 16, color: '#64748b' }}>
                    An unexpected error occurred while loading this page.
                </p>
                <button
                    onClick={reset}
                    style={{
                        height: 40,
                        padding: '0 16px',
                        borderRadius: 8,
                        border: '1px solid #cbd5e1',
                        background: '#fff',
                        cursor: 'pointer',
                    }}
                >
                    Try again
                </button>
            </div>
        </div>
    );
}

