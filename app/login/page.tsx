export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d1a14', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 32, width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 40, height: 40, background: '#c8902a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontWeight: 700, fontSize: 14, color: '#0d1a14' }}>B●</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>Biodiesel<span style={{ color: '#c8902a' }}>OS</span></div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>INGRESÁ A TU CUENTA</div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>EMAIL</label>
          <input type="email" placeholder="tu@empresa.com.ar" style={{ width: '100%', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, fontSize: 13, color: '#fff', background: 'rgba(255,255,255,0.06)', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <button style={{ width: '100%', padding: 12, background: '#c8902a', border: 'none', borderRadius: 4, fontSize: 13, color: '#0d1a14', fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>
          Enviar link de acceso
        </button>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 16 }}>
          ¿No tenés cuenta? <a href="/register" style={{ color: '#c8902a', textDecoration: 'none' }}>Registrarse</a>
        </p>
      </div>
    </div>
  )
}
