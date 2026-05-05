import { Sidebar } from '@/components/Sidebar'
import { KpiCard } from '@/components/KpiCard'
import { Badge } from '@/components/Badge'

export default function AdminDashboard() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#ede8dc' }}>
      <Sidebar role="ADMIN" nombre="Super Admin" provincia="BiodieselOS" />
      <main style={{ flex: 1 }}>
        <div style={{ background: '#fff', borderBottom: '1px solid rgba(13,26,20,0.1)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Panel de control — Plataforma</div>
            <div style={{ fontSize: 10, color: 'rgba(13,26,20,0.4)', marginTop: 2 }}>38 usuarios activos · Sistema operativo</div>
          </div>
          <Badge text="● Sistema OK" color="green" />
        </div>

        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
            <KpiCard label="GMV total plataforma" value="$48.2M" variant="green" sub="▲ +34% este mes" />
            <KpiCard label="Revenue (fees)" value="$289K" variant="amber" sub="▲ +28% MoM" />
            <KpiCard label="Proveedores activos" value="17" variant="blue" sub="+3 nuevos este mes" />
            <KpiCard label="Plantas sin EUDR" value="8" variant="red" sub="↓ Acción urgente" />
          </div>

          <div style={{ background: '#fff', border: '1px solid rgba(13,26,20,0.1)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(13,26,20,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Alertas del sistema</div>
              <Badge text="6 pendientes" color="amber" />
            </div>
            <div style={{ padding: '8px 16px' }}>
              {[
                { icon: '🚨', title: '8 plantas sin EUDR — deadline 214 días', meta: 'Enviar recordatorio automático', color: 'red' as const },
                { icon: '⚠️', title: 'KYB pendiente — BioPlanta Tucumán', meta: 'Documentación incompleta · Hace 3 días', color: 'amber' as const },
                { icon: '✅', title: 'Contrato CONT-2026-034 liquidado', meta: 'YPF · $1.254M · Fee: $7.524K cobrado', color: 'green' as const },
                { icon: '📋', title: 'Nueva solicitud de proveedor', meta: 'Agroenergía Salta SRL · Pendiente aprobación', color: 'amber' as const },
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(13,26,20,0.06)', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 20 }}>{a.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: 'rgba(13,26,20,0.4)', marginTop: 2 }}>{a.meta}</div>
                  </div>
                  <button style={{ background: 'transparent', border: '1px solid rgba(13,26,20,0.15)', borderRadius: 3, padding: '4px 10px', fontSize: 10, cursor: 'pointer', color: '#4a8c5c' }}>
                    Gestionar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
