export default function Login() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', padding: 40 }}>
      <section
        style={{
          margin: '0 auto',
          maxWidth: 520,
          border: '1px solid #e2e8f0',
          borderRadius: 16,
          background: '#fff',
          padding: 32,
          boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)',
        }}
      >
        <h1 style={{ margin: '0 0 12px', fontSize: 36 }}>Login</h1>
        <p style={{ color: '#475569', fontSize: 17, lineHeight: 1.6 }}>
          Account login is not connected yet. This page is a placeholder for the
          PRD's required auth flow.
        </p>
        <a
          href="/edit"
          style={{
            display: 'inline-flex',
            marginTop: 20,
            borderRadius: 10,
            background: '#2563eb',
            color: '#fff',
            padding: '14px 22px',
            fontWeight: 800,
            textDecoration: 'none',
          }}
        >
          Continue to editor
        </a>
      </section>
    </main>
  )
}
