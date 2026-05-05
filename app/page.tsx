const PRECIOS = [
  { nombre: 'Biodiesel B100',  subtipo: 'MERCADO INTERNO · $/T', valor: '$842K', cambio: '▲ +1.2%', up: true },
  { nombre: 'Biodiesel Export', subtipo: 'FOB ROSARIO · USD/T',  valor: '$1.247', cambio: '▲ +0.8%', up: true },
  { nombre: 'Aceite de Soja',  subtipo: 'REFERENCIA · USD/T',    valor: '$923',  cambio: '▼ -0.4%', up: false },
]

const FEATURES = [
  { icon: '🌍', title: 'Trazabilidad EUDR automática',   desc: 'DDS generado por lote. Geolocalización y verificación satelital de deforestación. Submisión automática a EU TRACES. Deadline: diciembre 2026.' },
  { icon: '⚡', title: 'Matching comprador–vendedor',     desc: 'Algoritmo que cruza calidad FAME, volumen, distancia y precio. Score 0–100 por oferta. Encontrás el mejor deal en minutos, no días.' },
  { icon: '📋', title: 'Contratos FOSFA digitales',      desc: 'Templates basados en FOSFA 54, adaptados al marco legal argentino y Ley 26.093. Cláusulas ISCC, EUDR y AFIP incorporadas. Firma digital.' },
  { icon: '🏛️', title: 'Carta de porte AFIP integrada', desc: 'Generación automática desde el contrato cerrado. Pre-llenado con todos los datos del deal. 45 minutos ahorrados por operación.' },
  { icon: '📊', title: 'Precios spot en tiempo real',    desc: 'Biodiesel interno, FOB Rosario y referencia CBOT actualizado cada 2 horas. El primer precio spot público de biodiesel Argentina.' },
  { icon: '💰', title: 'Financiamiento pre-export',      desc: 'Anticipo del 60–70% contra contrato firmado. SGRs certificadas integradas. Sin burocracia adicional. Resolvé el gap de caja en 48hs.' },
]

const PASOS = [
  { num: '01', title: 'Registrá tu planta', desc: 'Completás el formulario con tu CUIT y datos de la empresa. Verificamos tu habilitación en Secretaría de Energía.' },
  { num: '02', title: 'Publicás tu oferta',  desc: 'Cargás el lote: volumen, calidad FAME, precio y fechas de entrega. El sistema geolocaliza automáticamente para el matching.' },
  { num: '03', title: 'Recibís compradores', desc: 'Petroleras y exportadoras ven tu oferta rankeada por compatibilidad. Negociás directo en la plataforma.' },
  { num: '04', title: 'Cerrás con un clic',  desc: 'Contrato digital generado automáticamente. Carta de porte AFIP incluida. EUDR compliance certificado.' },
]

const STATS = [
  { n: '70%',   l: 'capacidad ociosa disponible' },
  { n: '7m',    l: 'para deadline EUDR' },
  { n: '0%',    l: 'arancel UE — Mercosur activo' },
  { n: '2.1M t',l: 'producción potencial 2031' },
]

const TESTIMONIOS = [
  { texto: '"Antes tardábamos 3 días en cerrar una venta. Con BiodieselOS fue cuestión de horas y el contrato salió listo para firmar."', nombre: 'Gerente Comercial', empresa: 'Planta de biodiesel — Corrientes', iniciales: 'GC' },
  { texto: '"El EUDR nos preocupaba mucho. La plataforma resolvió la trazabilidad de todos nuestros lotes en una sola tarde."', nombre: 'Director de Operaciones', empresa: 'Exportadora — Rosario', iniciales: 'DO' },
  { texto: '"Finalmente podemos ver el precio real del mercado antes de aceptar una oferta del acopiador. Cambió completamente nuestra negociación."', nombre: 'Productor', empresa: 'Planta independiente — Entre Ríos', iniciales: 'PR' },
]

const s = (extra = {}) => ({ ...extra } as React.CSSProperties)

export default function Home() {
  return (
    <div style={{ background: '#0d1a14', minHeight: '100vh', color: '#fafaf8', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── NAV ── */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, position: 'sticky', top: 0, background: 'rgba(13,26,20,0.95)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: '#c8902a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#0d1a14' }}>B●</div>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>Biodiesel<span style={{ color: '#c8902a' }}>OS</span></span>
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {['Precios', 'Plataforma', 'Exportación', 'Nosotros'].map(item => (
            <a key={item} href={item === 'Precios' ? '/precios' : '#'} style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>{item}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/login" style={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, padding: '8px 18px', fontSize: 13, color: '#fff', textDecoration: 'none' }}>Ingresar</a>
          <a href="/register" style={{ background: '#c8902a', borderRadius: 4, padding: '8px 18px', fontSize: 13, color: '#0d1a14', fontWeight: 700, textDecoration: 'none' }}>Comenzar gratis →</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 32px 56px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(200,144,42,0.12)', border: '1px solid rgba(200,144,42,0.3)', borderRadius: 20, padding: '5px 14px', marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c8902a', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 11, color: '#c8902a', letterSpacing: '0.06em' }}>Mercosur–UE activo · Mayo 2026</span>
          </div>
          <h1 style={{ fontSize: 'clamp(32px,4.5vw,54px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 20 }}>
            La infraestructura digital del{' '}
            <span style={{ color: '#c8902a' }}>biodiesel</span> argentino
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 32, maxWidth: 460 }}>
            Conectamos plantas productoras con petroleras y compradores europeos.
            Trazabilidad EUDR automática, contratos digitales y precio transparente — todo en un lugar.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
            <a href="/register?tipo=planta"    style={{ background: '#c8902a', borderRadius: 4, padding: '13px 26px', fontSize: 14, color: '#0d1a14', fontWeight: 700, textDecoration: 'none' }}>Registrar mi planta</a>
            <a href="/register?tipo=comprador" style={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: 4, padding: '13px 26px', fontSize: 14, color: '#fff', textDecoration: 'none' }}>Soy comprador →</a>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {['ISCC integrado', 'EUDR automático', 'AFIP nativo', 'Sin setup'].map(f => (
              <span key={f} style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                <span style={{ color: '#c8902a', marginRight: 5 }}>✓</span>{f}
              </span>
            ))}
          </div>
        </div>

        {/* PRICE TICKER */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 12, padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: 10, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)' }}>PRECIOS DE REFERENCIA</span>
            <span style={{ fontSize: 9, color: '#4caf50', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4caf50', display: 'inline-block' }} />EN VIVO
            </span>
          </div>
          {PRECIOS.map(p => (
            <div key={p.nombre} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{p.nombre}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 2, letterSpacing: '0.05em' }}>{p.subtipo}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{p.valor}</div>
                <div style={{ fontSize: 11, color: p.up ? '#4caf50' : '#ef5350' }}>{p.cambio}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Corte obligatorio actual</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#c8902a' }}>B7.5 → B15</span>
            </div>
            <a href="/precios" style={{ display: 'block', marginTop: 12, background: 'rgba(200,144,42,0.12)', border: '1px solid rgba(200,144,42,0.25)', borderRadius: 4, padding: '8px', textAlign: 'center', fontSize: 12, color: '#c8902a', textDecoration: 'none' }}>
              Ver todos los precios →
            </a>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '28px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ padding: '0 24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none', paddingLeft: i === 0 ? 0 : undefined }}>
              <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-0.03em', color: '#c8902a' }}>{s.n}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4, letterSpacing: '0.04em' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div style={{ padding: '72px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.1em', color: '#c8902a', marginBottom: 10 }}>LA PLATAFORMA</div>
            <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>Todo en un solo flujo</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto' }}>
              Desde la publicación de la oferta hasta el DDS europeo — sin salir de la plataforma.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 22, transition: 'border-color 0.2s' }}>
                <div style={{ fontSize: 26, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 7 }}>{f.title}</div>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CÓMO FUNCIONA ── */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '72px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.1em', color: '#c8902a', marginBottom: 10 }}>CÓMO FUNCIONA</div>
            <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.02em' }}>De la oferta al contrato en 4 pasos</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
            {PASOS.map((p, i) => (
              <div key={i} style={{ position: 'relative' }}>
                {i < 3 && <div style={{ position: 'absolute', top: 20, left: '60%', right: '-20%', height: 1, background: 'rgba(200,144,42,0.3)', zIndex: 0 }} />}
                <div style={{ width: 40, height: 40, border: '2px solid #c8902a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#c8902a', marginBottom: 16, background: '#0d1a14', position: 'relative', zIndex: 1 }}>
                  {p.num}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{p.title}</div>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TESTIMONIOS ── */}
      <div style={{ padding: '72px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.1em', color: '#c8902a', marginBottom: 10 }}>TESTIMONIOS</div>
            <h2 style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-0.02em' }}>Lo que dicen los primeros usuarios</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
            {TESTIMONIOS.map((t, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 24 }}>
                <div style={{ fontSize: 28, color: '#c8902a', marginBottom: 16, lineHeight: 1 }}>"</div>
                <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>{t.texto.replace(/^"|"$/g, '')}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(200,144,42,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#c8902a' }}>{t.iniciales}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{t.nombre}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{t.empresa}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA FINAL ── */}
      <div style={{ background: 'rgba(200,144,42,0.07)', borderTop: '1px solid rgba(200,144,42,0.15)', borderBottom: '1px solid rgba(200,144,42,0.15)', padding: '72px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.1em', color: '#c8902a', marginBottom: 12 }}>EUDR DEADLINE: DICIEMBRE 2026</div>
        <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 16, maxWidth: 600, margin: '0 auto 16px' }}>
          Quedan 7 meses para que tu planta pueda exportar a Europa
        </h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Sin trazabilidad EUDR certificada, el biodiesel argentino no entra a la UE. BiodieselOS te lo resuelve automáticamente.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/register" style={{ background: '#c8902a', borderRadius: 4, padding: '14px 32px', fontSize: 15, color: '#0d1a14', fontWeight: 700, textDecoration: 'none' }}>Registrar mi planta gratis</a>
          <a href="/login" style={{ border: '1px solid rgba(255,255,255,0.25)', borderRadius: 4, padding: '14px 32px', fontSize: 15, color: '#fff', textDecoration: 'none' }}>Ya tengo cuenta</a>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '48px 32px 28px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, background: '#c8902a', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#0d1a14' }}>B●</div>
                <span style={{ fontSize: 16, fontWeight: 700 }}>Biodiesel<span style={{ color: '#c8902a' }}>OS</span></span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: 280, marginBottom: 16 }}>
                La infraestructura digital del biodiesel argentino. Conectamos plantas productoras con el mercado interno y europeo.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {['🇦🇷 Argentina', '🇪🇺 Europa', '🌱 EUDR Ready'].map(tag => (
                  <span key={tag} style={{ fontSize: 11, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '3px 10px', color: 'rgba(255,255,255,0.5)' }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Plataforma */}
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', marginBottom: 14, textTransform: 'uppercase' as const }}>Plataforma</div>
              {[
                { label: 'Precios en vivo', href: '/precios' },
                { label: 'Para productores', href: '/register?tipo=planta' },
                { label: 'Para compradores', href: '/register?tipo=comprador' },
                { label: 'Dashboard demo', href: '/login' },
              ].map(l => (
                <a key={l.label} href={l.href} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginBottom: 10, lineHeight: 1.4 }}>{l.label}</a>
              ))}
            </div>

            {/* Compliance */}
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', marginBottom: 14, textTransform: 'uppercase' as const }}>Compliance</div>
              {[
                { label: 'EUDR / DDS', href: '#' },
                { label: 'Certificación ISCC', href: '#' },
                { label: 'Carta de porte AFIP', href: '#' },
                { label: 'Contratos FOSFA', href: '#' },
                { label: 'Mercosur–UE', href: '#' },
              ].map(l => (
                <a key={l.label} href={l.href} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginBottom: 10 }}>{l.label}</a>
              ))}
            </div>

            {/* Empresa */}
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', marginBottom: 14, textTransform: 'uppercase' as const }}>Empresa</div>
              {[
                { label: 'Sobre nosotros', href: '#' },
                { label: 'Blog', href: '#' },
                { label: 'Contacto', href: 'mailto:hola@biodiesel-os.com' },
                { label: 'Inversores', href: '#' },
              ].map(l => (
                <a key={l.label} href={l.href} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginBottom: 10 }}>{l.label}</a>
              ))}

              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 10, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', marginBottom: 10, textTransform: 'uppercase' as const }}>Contacto</div>
                <a href="mailto:hola@biodiesel-os.com" style={{ fontSize: 12, color: '#c8902a', textDecoration: 'none' }}>hola@biodiesel-os.com</a>
              </div>
            </div>
          </div>

          {/* Footer bottom */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
              © 2026 BiodieselOS · Construido en Argentina 🇦🇷 para el mercado europeo 🇪🇺
            </span>
            <div style={{ display: 'flex', gap: 16 }}>
              {['Términos de uso', 'Privacidad', 'Cookies'].map(l => (
                <a key={l} href="#" style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
