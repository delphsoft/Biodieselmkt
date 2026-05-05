import { Sidebar } from '@/components/Sidebar'
import { KpiCard } from '@/components/KpiCard'
import { Badge } from '@/components/Badge'

export default function ProveedorDashboard() {
  const empresa = { nombre: 'Bioenergia Virasoro', provincia: 'Corrientes' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#ede8dc' }}>
      <Sidebar role="PROVEEDOR" nombre={empresa.nombre} provincia={empresa.provincia} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <div style={{ background: '#fff', borderBottom: '1px solid rgba(13,26,20,0.1)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Dashboard Proveedor</div>
            <div style={{ fontSize: 10, color: 'rgba(13,26,20,0.4)', marginTop: 2 }}>{empresa.nombre} · actualizado ahora</div>
          </div>
          <a href="/dashboard/proveedor/ofertas/nueva" style={{ background: '#c8902a', borderRadius: 3, padding: '8px 16px', fontSize: 11, color: '#0d1a14', fontWeight: 700, textDecoration: 'none' }}>
            + Nueva oferta
          </a>
        </div>

        <div style={{ padding: '20px 24px' }}>
          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
            <KpiCard label="Volumen disponible" value="3.800 t" variant="green" sub="Listo para entrega" />
            <KpiCard label="Precio spot hoy" value="$842K/t" variant="amber" sub="▲ +1.2% vs ayer" />
            <KpiCard label="Contratos activos" value="2" variant="blue" sub="$3.8M en curso" />
            <KpiCard label="EUDR deadline" value="214 d" variant="red" sub="↓ Acción requerida" />
          </div>

          {/* Ofertas activas */}
          <div style={{ background: '#fff', border: '1px solid rgba(13,26,20,0.1)', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(13,26,20,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Ofertas activas</div>
              <Badge text="3 publicadas" color="green" />
            </div>
            <div style={{ padding: 16 }}>
              {[
                { lote: 'Lote #2026-089', vol: '1.200 t', fame: '98.2%', precio: '$845K', iscc: true, eudr: true, status: 'En negociación' },
                { lote: 'Lote #2026-090', vol: '2.600 t', fame: '97.8%', precio: '$840K', iscc: true, eudr: false, status: 'Publicado' },
              ].map(o => (
                <div key={o.lote} style={{ border: '1px solid rgba(13,26,20,0.1)', borderRadius: 6, padding: 14, marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{o.lote}</div>
                      <div style={{ fontSize: 11, color: 'rgba(13,26,20,0.4)', marginTop: 2 }}>{o.vol} · FAME {o.fame}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 800 }}>{o.precio}</div>
                      <div style={{ fontSize: 10, color: 'rgba(13,26,20,0.4)' }}>por tonelada</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {o.iscc && <Badge text="ISCC ✓" color="green" />}
                    {o.eudr ? <Badge text="EUDR ✓" color="green" /> : <Badge text="EUDR pendiente" color="amber" />}
                    <Badge text={o.status} color={o.status === 'En negociación' ? 'amber' : 'grey'} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificaciones */}
          <div style={{ background: '#fff', border: '1px solid rgba(13,26,20,0.1)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(13,26,20,0.08)' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Certificaciones</div>
            </div>
            <div style={{ padding: '8px 18px' }}>
              {[
                { name: 'ISCC EU', sub: 'vence 15/03/2027', status: 'Activo', color: 'green' as const },
                { name: 'EUDR – DDS Lote #089', sub: 'Verificado', status: 'Generado', color: 'green' as const },
                { name: 'EUDR – DDS Lote #090', sub: 'Pendiente', status: 'Pendiente', color: 'amber' as const },
              ].map(c => (
                <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(13,26,20,0.06)' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(13,26,20,0.4)' }}>{c.sub}</div>
                  </div>
                  <Badge text={c.status} color={c.color} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
