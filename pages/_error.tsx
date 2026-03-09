import type { NextPageContext } from 'next';

type ErrorProps = {
    statusCode?: number;
};

function ErrorPage({ statusCode }: ErrorProps) {
    const code = statusCode || 500;

    return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
            <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
                <h1 style={{ marginBottom: 8 }}>Error {code}</h1>
                <p style={{ color: '#64748b' }}>An unexpected error occurred.</p>
            </div>
        </div>
    );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
    const statusCode = res ? res.statusCode : err ? (err as any).statusCode : 500;
    return { statusCode };
};

export default ErrorPage;

