import { Sidebar } from '@/components/Sidebar'
import { KpiCard } from '@/components/KpiCard'
import { Badge } from '@/components/Badge'

export default function CompradorDashboard() {
  const empresa = { nombre: 'Axion Energy S.A.', provincia: 'Rosario, SF' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#ede8dc' }}>
      <Sidebar role="COMPRADOR" nombre={empresa.nombre} provincia={empresa.provincia} />
      <main style={{ flex: 1 }}>
        <div style={{ background: '#fff', borderBottom: '1px solid rgba(13,26,20,0.1)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Buscar y comprar biodiesel</div>
            <div style={{ fontSize: 10, color: 'rgba(13,26,20,0.4)', marginTop: 2 }}>38 ofertas disponibles · mejor precio: $839K/t</div>
          </div>
          <button style={{ background: '#c8902a', border: 'none', borderRadius: 3, padding: '8px 16px', fontSize: 11, color: '#0d1a14', fontWeight: 700, cursor: 'pointer' }}>
            Crear RFQ
          </button>
        </div>

        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
            <KpiCard label="Cupo mensual restante" value="4.200 t" variant="blue" sub="de 6.000 t asignadas" />
            <KpiCard label="Mejor precio hoy" value="$839K/t" variant="green" sub="▼ -0.4% vs ayer" />
            <KpiCard label="Ofertas ISCC verificadas" value="24" variant="amber" sub="de 38 totales" />
            <KpiCard label="Cumplimiento B7.5" value="91%" variant="green" sub="▲ en objetivo" />
          </div>

          <div style={{ background: '#fff', border: '1px solid rgba(13,26,20,0.1)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(13,26,20,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Ofertas disponibles</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <Badge text="Solo ISCC" color="green" />
                <Badge text="Con EUDR" color="blue" />
              </div>
            </div>
            <div style={{ padding: 16 }}>
              {[
                { nombre: 'Bioenergia Virasoro', loc: 'Corrientes · 780 km', vol: '1.200 t', fame: '98.2%', precio: '$839K', iscc: true, eudr: true },
                { nombre: 'Bio del Litoral', loc: 'Entre Ríos · 310 km', vol: '2.800 t', fame: '97.6%', precio: '$843K', iscc: true, eudr: false },
                { nombre: 'AgroBio Córdoba', loc: 'Córdoba · 400 km', vol: '900 t', fame: '97.1%', precio: '$851K', iscc: false, eudr: false },
              ].map((o, i) => (
                <div key={i} style={{ border: `1px solid ${i === 0 ? '#c8902a' : 'rgba(13,26,20,0.1)'}`, background: i === 0 ? 'rgba(200,144,42,0.04)' : 'transparent', borderRadius: 6, padding: 14, marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{o.nombre}</div>
                      <div style={{ fontSize: 11, color: 'rgba(13,26,20,0.4)', marginTop: 2 }}>📍 {o.loc}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 800 }}>{o.precio}</div>
                      <div style={{ fontSize: 10, color: 'rgba(13,26,20,0.4)' }}>{o.vol}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const }}>
                    {o.iscc && <Badge text="ISCC ✓" color="green" />}
                    {o.eudr ? <Badge text="EUDR ✓" color="green" /> : <Badge text="EUDR pendiente" color="amber" />}
                    <Badge text={`FAME ${o.fame}`} color="blue" />
                  </div>
                  {i === 0 && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <button style={{ flex: 1, background: '#c8902a', border: 'none', borderRadius: 3, padding: '8px', fontSize: 12, color: '#0d1a14', fontWeight: 700, cursor: 'pointer' }}>Hacer oferta</button>
                      <button style={{ flex: 1, background: 'transparent', border: '1px solid rgba(13,26,20,0.15)', borderRadius: 3, padding: '8px', fontSize: 12, cursor: 'pointer' }}>Ver detalles</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
