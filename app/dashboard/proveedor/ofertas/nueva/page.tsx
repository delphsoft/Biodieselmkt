import { Sidebar } from '@/components/Sidebar'
import { requireRole } from '@/lib/session'
import { crearOferta } from '@/app/actions/ofertas'

const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid rgba(13,26,20,0.15)', borderRadius: 4, fontSize: 13, boxSizing: 'border-box' as const }
const labelStyle = { display: 'block', fontSize: 10, letterSpacing: '0.06em', color: 'rgba(13,26,20,0.5)', marginBottom: 6 }

export default async function NuevaOfertaPage() {
  const { empresa } = await requireRole('PROVEEDOR')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#ede8dc' }}>
      <Sidebar role="PROVEEDOR" nombre={empresa!.razonSocial} provincia={empresa!.provincia} />
      <main style={{ flex: 1, padding: '24px 32px', maxWidth: 520 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Nueva oferta</h1>
        <p style={{ fontSize: 12, color: 'rgba(13,26,20,0.5)', marginBottom: 20 }}>
          Publicá un lote de biodiesel para que compradores lo vean rankeado por el matching.
        </p>

        <form action={crearOferta} style={{ background: '#fff', border: '1px solid rgba(13,26,20,0.1)', borderRadius: 8, padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>VOLUMEN (T)</label>
              <input name="volumenTon" type="number" step="0.01" min="0" required style={inputStyle} placeholder="1200" />
            </div>
            <div>
              <label style={labelStyle}>CALIDAD FAME (%)</label>
              <input name="famePct" type="number" step="0.01" min="0" max="100" required style={inputStyle} placeholder="98.2" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>PRECIO (ARS/T) — opcional</label>
              <input name="precioARS" type="number" step="0.01" min="0" style={inputStyle} placeholder="845000" />
            </div>
            <div>
              <label style={labelStyle}>MERCADO</label>
              <select name="tipoMercado" style={inputStyle} defaultValue="INTERNO">
                <option value="INTERNO">Interno</option>
                <option value="EXPORT">Exportación</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>LATITUD PLANTA — opcional</label>
              <input name="lat" type="number" step="0.0001" style={inputStyle} placeholder="-31.4" />
            </div>
            <div>
              <label style={labelStyle}>LONGITUD PLANTA — opcional</label>
              <input name="lng" type="number" step="0.0001" style={inputStyle} placeholder="-60.9" />
            </div>
          </div>

          <button type="submit" style={{ width: '100%', padding: 12, background: '#c8902a', border: 'none', borderRadius: 4, fontSize: 13, color: '#0d1a14', fontWeight: 700, cursor: 'pointer' }}>
            Publicar oferta →
          </button>
        </form>
      </main>
    </div>
  )
}
