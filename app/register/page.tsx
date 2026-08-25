'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { empresaSchema, TIPOS_EMPRESA, type EmpresaFormInput } from '@/lib/validation'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<EmpresaFormInput & { email: string }>({
    razonSocial: '', cuit: '', email: '', provincia: '', tipo: 'PLANTA'
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const { email, ...empresaData } = form
    const parsed = empresaSchema.safeParse(empresaData)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Datos inválidos')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      // Los datos de la empresa viajan en user_metadata: en este paso todavía
      // no hay sesión (recién se crea al confirmar el magic link), así que
      // /auth/callback los toma de ahí para crear la fila Empresa definitiva
      // (con validación Zod server-side en ensureEmpresaFromSession).
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: parsed.data,
        },
      })
      if (otpError) throw otpError
      setSent(true)
    } catch {
      setError('No pudimos enviar el email. Intentá de nuevo.')
    }
    setLoading(false)
  }

  const inp = (extra = {}) => ({
    style: { width: '100%', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, fontSize: 13, color: '#fff', background: 'rgba(255,255,255,0.06)', outline: 'none', boxSizing: 'border-box' as const },
    ...extra
  })

  const TIPO_LABELS: Record<(typeof TIPOS_EMPRESA)[number], string> = {
    PLANTA: '🏭 Planta productora',
    PETROLERA: '⛽ Comprador / Petrolera',
    EXPORTADORA: '🚢 Exportadora',
    DISTRIBUIDOR: '🚛 Distribuidor',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1a14', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 32, width: '100%', maxWidth: 420 }}>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 40, height: 40, background: '#c8902a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontWeight: 700, fontSize: 14, color: '#0d1a14' }}>B●</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Biodiesel<span style={{ color: '#c8902a' }}>OS</span></div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4, letterSpacing: '0.06em' }}>CREAR CUENTA</div>
        </div>

        {sent ? (
          <div style={{ background: 'rgba(74,140,92,0.12)', border: '1px solid rgba(74,140,92,0.3)', borderRadius: 8, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📧</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 6 }}>¡Revisá tu email!</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
              Enviamos un link de acceso a <strong style={{ color: '#fff' }}>{form.email}</strong>. Al confirmarlo creamos tu cuenta y entrás directo al dashboard.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Tipo de cuenta — primero */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>TIPO DE CUENTA</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {TIPOS_EMPRESA.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, tipo: t }))}
                    style={{
                      padding: '10px 8px', borderRadius: 6, fontSize: 12, cursor: 'pointer', textAlign: 'left' as const,
                      background: form.tipo === t ? 'rgba(200,144,42,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${form.tipo === t ? '#c8902a' : 'rgba(255,255,255,0.1)'}`,
                      color: form.tipo === t ? '#c8902a' : 'rgba(255,255,255,0.6)',
                      fontWeight: form.tipo === t ? 600 : 400,
                    }}
                  >{TIPO_LABELS[t]}</button>
                ))}
              </div>
            </div>

            {[
              { key: 'razonSocial', label: 'RAZÓN SOCIAL', type: 'text', placeholder: 'Bioenergia S.A.' },
              { key: 'cuit', label: 'CUIT', type: 'text', placeholder: '30-XXXXXXXX-X' },
              { key: 'email', label: 'EMAIL CORPORATIVO', type: 'email', placeholder: 'tu@empresa.com.ar' },
              { key: 'provincia', label: 'PROVINCIA', type: 'text', placeholder: 'Córdoba' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  required
                  value={(form as any)[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  {...inp()}
                />
              </div>
            ))}

            {error && (
              <div style={{ fontSize: 12, color: '#ef5350', marginBottom: 12, fontFamily: 'monospace' }}>✗ {error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: 12, background: loading ? 'rgba(200,144,42,0.5)' : '#c8902a', border: 'none', borderRadius: 4, fontSize: 13, color: '#0d1a14', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }}
            >
              {loading ? 'Enviando...' : 'Crear cuenta →'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 14 }}>
              ¿Ya tenés cuenta? <a href="/login" style={{ color: '#c8902a', textDecoration: 'none' }}>Ingresar</a>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
