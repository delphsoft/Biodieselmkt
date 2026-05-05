const PRECIOS = [
  { nombre: 'Biodiesel B100', subtipo: 'MERCADO INTERNO · $/T', valor: '$842K', cambio: '▲ +1.2%', up: true },
  { nombre: 'Biodiesel Export', subtipo: 'FOB ROSARIO · USD/T', valor: '$1.247', cambio: '▲ +0.8%', up: true },
  { nombre: 'Aceite de Soja', subtipo: 'REFERENCIA · USD/T', valor: '$923', cambio: '▼ -0.4%', up: false },
]

const FEATURES = [
  { icon: '🌍', title: 'Trazabilidad EUDR automática', desc: 'DDS generado por lote. Geolocalización y verificación satelital de deforestación incluida.' },
  { icon: '⚡', title: 'Matching comprador–vendedor', desc: 'Algoritmo que cruza FAME, volumen, distancia y precio para el mejor match en minutos.' },
  { icon: '📋', title: 'Contratos FOSFA digitales', desc: 'Templates FOSFA 54 adaptados al marco legal argentino + Ley 26.093. Firma digital.' },
  { icon: '🏛️', title: 'Carta de porte AFIP', desc: 'Generación automática desde el contrato. Pre-llenado con datos del deal.' },
  { icon: '📊', title: 'Precios spot en tiempo real', desc: 'Biodiesel interno, FOB Rosario y referencia CBOT. El primer precio spot público ARG.' },
  { icon: '💰', title: 'Financiamiento pre-export', desc: 'Anticipo del 60–70% contra contrato firmado. SGRs certificadas integradas.' },
]

export default function Home() {
  return (
    <div style={{ background: '#0d1a14', minHeight: '100vh', color: '#fafaf8' }}>

      {/* NAV */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: '#c8902a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#0d1a14' }}>B●</div>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>
            Biodiesel<span style={{ color: '#c8902a' }}>OS</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/login" style={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, padding: '8px 18px', fontSize: 13, color: '#fff', textDecoration: 'none' }}>Ingresar</a>
          <a href="/register" style={{ background: '#c8902a', borderRadius: 4, padding: '8px 18px', fontSize: 13, color: '#0d1a14', fontWeight: 700, textDecoration: 'none' }}>Comenzar →</a>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 32px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(200,144,42,0.12)', border: '1px solid rgba(200,144,42,0.3)', borderRadius: 20, padding: '5px 14px', marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c8902a' }} />
            <span style={{ fontSize: 11, color: '#c8902a', letterSpacing: '0.06em' }}>Mercosur–UE activo · Mayo 2026</span>
          </div>

          <h1 style={{ fontSize: 'clamp(32px,4.5vw,52px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 20 }}>
            La infraestructura digital del{' '}
            <span style={{ color: '#c8902a' }}>biodiesel</span> argentino
          </h1>

          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 28, maxWidth: 440 }}>
            Conectamos plantas productoras con petroleras y compradores europeos.
            Trazabilidad EUDR automática, contratos digitales y precio transparente.
          </p>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            <a href="/register" style={{ background: '#c8902a', borderRadius: 4, padding: '12px 24px', fontSize: 13, color: '#0d1a14', fontWeight: 700, textDecoration: 'none' }}>Registrar mi planta</a>
            <a href="/register" style={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, padding: '12px 24px', fontSize: 13, color: '#fff', textDecoration: 'none' }}>Soy comprador →</a>
          </div>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {['ISCC integrado', 'EUDR automático', 'AFIP nativo'].map(f => (
              <span key={f} style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>
                <span style={{ color: '#c8902a', marginRight: 4 }}>✓</span>{f}
              </span>
            ))}
          </div>
        </div>

        {/* PRICE TICKER */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: 10, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)' }}>PRECIOS DE REFERENCIA</span>
            <span style={{ fontSize: 9, color: '#4caf50', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4caf50', display: 'inline-block' }} />EN VIVO
            </span>
          </div>
          {PRECIOS.map(p => (
            <div key={p.nombre} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{p.nombre}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{p.subtipo}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{p.valor}</div>
                <div style={{ fontSize: 11, color: p.up ? '#4caf50' : '#ef5350' }}>{p.cambio}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '28px 32px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', maxWidth: 1100, margin: '0 auto' }}>
        {[
          { n: '70%', l: 'capacidad ociosa disponible' },
          { n: '7m', l: 'para deadline EUDR' },
          { n: '0%', l: 'arancel UE — Mercosur activo' },
          { n: '2.1M t', l: 'producción potencial 2031' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '0 20px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none', paddingLeft: i === 0 ? 0 : undefined }}>
            <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.03em' }}>
              <span style={{ color: '#c8902a' }}>{s.n}</span>
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4, letterSpacing: '0.05em' }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <div style={{ background: 'rgba(255,255,255,0.025)', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '48px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.1em', color: '#c8902a', marginBottom: 8 }}>POR QUÉ BIODIESELOS</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>Todo lo que necesitás para vender biodiesel</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, maxWidth: 1100, margin: '0 auto' }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: 20 }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '20px 32px', textAlign: 'center' }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          BiodieselOS © 2026 · Construido en Argentina 🇦🇷 para Europa 🇪🇺
        </span>
      </div>

    </div>
  )
}
