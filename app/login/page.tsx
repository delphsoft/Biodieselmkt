'use client'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo')

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const callbackUrl = new URL('/auth/callback', window.location.origin)
      if (redirectTo) callbackUrl.searchParams.set('redirectTo', redirectTo)

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: callbackUrl.toString() },
      })
      if (otpError) throw otpError
      setSent(true)
    } catch {
      setError('Error al enviar. Intentá de nuevo.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1a14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 32, width: '100%', maxWidth: 380 }}>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <div style={{ width: 40, height: 40, background: '#c8902a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontWeight: 700, fontSize: 14, color: '#0d1a14' }}>B●</div>
          </a>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Biodiesel<span style={{ color: '#c8902a' }}>OS</span></div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4, letterSpacing: '0.06em' }}>INGRESÁ A TU CUENTA</div>
        </div>

        {sent ? (
          <div style={{ background: 'rgba(74,140,92,0.12)', border: '1px solid rgba(74,140,92,0.3)', borderRadius: 8, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📧</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 6 }}>¡Revisá tu email!</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
              Enviamos un link de acceso a <strong style={{ color: '#fff' }}>{email}</strong>
            </div>
            <button
              onClick={() => { setSent(false); setEmail('') }}
              style={{ marginTop: 16, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, padding: '7px 16px', fontSize: 12, color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}
            >Usar otro email</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@empresa.com.ar"
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, fontSize: 13, color: '#fff', background: 'rgba(255,255,255,0.06)', outline: 'none', boxSizing: 'border-box' as const, marginBottom: 16 }}
            />

            {error && (
              <div style={{ fontSize: 12, color: '#ef5350', marginBottom: 12, fontFamily: 'monospace' }}>✗ {error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: 12, background: loading ? 'rgba(200,144,42,0.5)' : '#c8902a', border: 'none', borderRadius: 4, fontSize: 13, color: '#0d1a14', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Enviando...' : 'Enviar link de acceso'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 16 }}>
              ¿No tenés cuenta? <a href="/register" style={{ color: '#c8902a', textDecoration: 'none' }}>Registrarse</a>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
