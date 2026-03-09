'use client';

import { useEffect } from 'react';

type GlobalErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
    useEffect(() => {
        console.error('Global error boundary caught an error:', error);
    }, [error]);

    return (
        <html lang="en">
            <body>
                <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
                    <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
                        <h1 style={{ marginBottom: 8 }}>Application error</h1>
                        <p style={{ marginBottom: 16, color: '#64748b' }}>
                            The application encountered a critical error.
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
                            Reload
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}

