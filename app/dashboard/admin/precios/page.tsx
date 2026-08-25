import { Sidebar } from '@/components/Sidebar'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { actualizarPrecioSpot } from '@/app/actions/precios'
import { LABELS_PRECIO, formatearPrecio } from '@/lib/precios'

const inputStyle = { width: '100%', padding: '9px 11px', border: '1px solid rgba(13,26,20,0.15)', borderRadius: 4, fontSize: 12, boxSizing: 'border-box' as const }
const labelStyle = { display: 'block', fontSize: 9, letterSpacing: '0.06em', color: 'rgba(13,26,20,0.5)', marginBottom: 5 }

export default async function AdminPreciosPage() {
  await requireRole('ADMIN')

  const historial = await prisma.precioSpot.findMany({ orderBy: { fecha: 'desc' }, take: 20 })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#ede8dc' }}>
      <Sidebar role="ADMIN" nombre="Super Admin" provincia="BiodieselOS" />
      <main style={{ flex: 1, padding: '24px 32px' }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Precios spot</h1>
        <p style={{ fontSize: 12, color: '#c8902a', marginBottom: 20 }}>
          TODO: sin fuente automatizada confirmada (Bolsa Rosario / Sec. Energía). Carga manual hasta definir una integración.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20 }}>
          <form action={actualizarPrecioSpot} style={{ background: '#fff', border: '1px solid rgba(13,26,20,0.1)', borderRadius: 8, padding: 18, height: 'fit-content' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Publicar nuevo valor</div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>TIPO</label>
              <select name="tipo" style={inputStyle} defaultValue="BIODIESEL_INTERNO">
                {Object.entries(LABELS_PRECIO).map(([tipo, l]) => (
                  <option key={tipo} value={tipo}>{l.nombre}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={labelStyle}>VALOR</label>
                <input name="valor" type="number" step="0.01" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>MONEDA</label>
                <select name="moneda" style={inputStyle} defaultValue="ARS">
                  <option value="ARS">ARS</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>FUENTE</label>
              <input name="fuente" required style={inputStyle} placeholder="SEC_ENERGIA / BOLSA_ROSARIO" />
            </div>
            <button type="submit" style={{ width: '100%', padding: 10, background: '#c8902a', border: 'none', borderRadius: 4, fontSize: 12, color: '#0d1a14', fontWeight: 700, cursor: 'pointer' }}>
              Publicar
            </button>
          </form>

          <div style={{ background: '#fff', border: '1px solid rgba(13,26,20,0.1)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(13,26,20,0.08)', fontSize: 13, fontWeight: 600 }}>Historial</div>
            {historial.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 18px', borderBottom: '1px solid rgba(13,26,20,0.06)', fontSize: 12 }}>
                <div>{LABELS_PRECIO[p.tipo]?.nombre ?? p.tipo}</div>
                <div style={{ fontWeight: 600 }}>{formatearPrecio(p.valor, p.moneda)}</div>
                <div style={{ color: 'rgba(13,26,20,0.4)' }}>{p.fuente}</div>
                <div style={{ color: 'rgba(13,26,20,0.4)' }}>{p.fecha.toLocaleString('es-AR')}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
