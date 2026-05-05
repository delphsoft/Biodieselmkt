export default function PreciosPage() {
  const precios = [
    { tipo: 'Biodiesel B100', subtipo: 'MERCADO INTERNO', valor: '$842.500', moneda: 'ARS/t', cambio: '▲ +1.2%', up: true, fuente: 'Sec. Energía' },
    { tipo: 'Biodiesel Export', subtipo: 'FOB ROSARIO', valor: '$1.247', moneda: 'USD/t', cambio: '▲ +0.8%', up: true, fuente: 'Bolsa Rosario' },
    { tipo: 'Aceite de Soja', subtipo: 'REFERENCIA INSUMO', valor: '$923', moneda: 'USD/t', cambio: '▼ -0.4%', up: false, fuente: 'Bolsa Rosario' },
    { tipo: 'Gasoil Referencia', subtipo: 'BLEND BASE', valor: '$1.180.000', moneda: 'ARS/t', cambio: '→ 0.0%', up: true, fuente: 'Sec. Energía' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0d1a14' }}>
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, background: '#c8902a', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#0d1a14' }}>B●</div>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Biodiesel<span style={{ color: '#c8902a' }}>OS</span></span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#4caf50' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4caf50', display: 'inline-block' }} />
          PRECIOS EN VIVO
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px' }}>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
          Precios de referencia
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 32 }}>
          Actualizado cada 2 horas · Fuentes: Secretaría de Energía y Bolsa de Cereales de Rosario
        </p>

        <div style={{ display: 'grid', gap: 12 }}>
          {precios.map(p => (
            <div key={p.tipo} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{p.tipo}</div>
                <div style={{ fontSize: 10, letterSpacing: '0.07em', color: 'rgba(255,255,255,0.35)' }}>{p.subtipo} · {p.fuente}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{p.valor}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{p.moneda}</div>
                <div style={{ fontSize: 12, color: p.up ? '#4caf50' : '#ef5350' }}>{p.cambio}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, padding: '16px 20px', background: 'rgba(200,144,42,0.1)', border: '1px solid rgba(200,144,42,0.25)', borderRadius: 8 }}>
          <div style={{ fontSize: 11, color: '#c8902a', marginBottom: 6 }}>CORTE OBLIGATORIO ACTUAL</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>B7.5 <span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.5)' }}>→ B15 proyectado 2026</span></div>
        </div>
      </div>
    </div>
  )
}
