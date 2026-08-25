import { prisma } from '@/lib/prisma'
import { formatearPrecio, LABELS_PRECIO } from '@/lib/precios'

// TODO: sin fuente automatizada confirmada (Bolsa Rosario / Sec. Energía).
// Estos valores son el último precio cargado a mano por un admin en
// /dashboard/admin/precios — no se refrescan solos cada 2hs todavía.
export const dynamic = 'force-dynamic'

export default async function PreciosPage() {
  const tipos = Object.keys(LABELS_PRECIO)
  const precios = (
    await Promise.all(tipos.map(tipo => prisma.precioSpot.findFirst({ where: { tipo }, orderBy: { fecha: 'desc' } })))
  ).filter((p): p is NonNullable<typeof p> => p !== null)

  return (
    <div style={{ minHeight: '100vh', background: '#0d1a14' }}>
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, background: '#c8902a', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#0d1a14' }}>B●</div>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Biodiesel<span style={{ color: '#c8902a' }}>OS</span></span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'inline-block' }} />
          CARGA MANUAL — VER TODO
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px' }}>
        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
          Precios de referencia
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 32 }}>
          Último valor cargado por el equipo de BiodieselOS · fuentes: Secretaría de Energía y Bolsa de Cereales de Rosario
        </p>

        {precios.length === 0 && (
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center', padding: 40, border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 10 }}>
            Todavía no hay precios cargados.
          </div>
        )}

        <div style={{ display: 'grid', gap: 12 }}>
          {precios.map(p => {
            const label = LABELS_PRECIO[p.tipo]
            return (
              <div key={p.tipo} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{label?.nombre ?? p.tipo}</div>
                  <div style={{ fontSize: 10, letterSpacing: '0.07em', color: 'rgba(255,255,255,0.35)' }}>{label?.subtipo} · {p.fuente}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{formatearPrecio(p.valor, p.moneda)}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{p.moneda}/t</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{p.fecha.toLocaleString('es-AR')}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
