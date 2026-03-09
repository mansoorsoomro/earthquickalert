import Link from 'next/link';

export default function NotFound() {
    return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
            <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
                <h1 style={{ marginBottom: 8 }}>Page not found</h1>
                <p style={{ marginBottom: 16, color: '#64748b' }}>
                    The page you are looking for does not exist.
                </p>
                <Link
                    href="/"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 40,
                        padding: '0 16px',
                        borderRadius: 8,
                        border: '1px solid #cbd5e1',
                        textDecoration: 'none',
                        color: '#0f172a',
                        background: '#fff',
                    }}
                >
                    Go home
                </Link>
            </div>
        </div>
    );
}

