import { Sidebar } from '@/components/Sidebar'
import { KpiCard } from '@/components/KpiCard'
import { Badge } from '@/components/Badge'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { checkAndExpireIscc } from '@/lib/iscc'
import { diasHastaDeadlineEudr } from '@/lib/eudr'

// TODO: no hay un modelo de pricing/fees todavía — esta tasa es un
// placeholder documentado hasta que se defina el modelo de negocio real.
// Cuando exista, mover a una tabla de configuración en vez de una constante.
const PLATFORM_FEE_RATE = 0.006

export default async function AdminDashboard() {
  await requireRole('ADMIN')
  const vencidosRecientes = await checkAndExpireIscc()

  const [contratosCerrados, plantas, totalUsuarios, contratosBorrador, empresasRecientes] = await Promise.all([
    prisma.contratoFosfa.findMany({
      where: { status: { in: ['FIRMADO', 'EN_TRANSITO', 'COMPLETADO'] } },
      select: { volumenTon: true, precioAcordadoUSD: true },
    }),
    prisma.empresa.findMany({
      where: { tipo: 'PLANTA' },
      include: { ofertas: { select: { eudrVerificado: true } } },
    }),
    prisma.empresa.count(),
    prisma.contratoFosfa.count({ where: { status: 'BORRADOR' } }),
    prisma.empresa.findMany({ orderBy: { createdAt: 'desc' }, take: 3 }),
  ])

  const gmvUSD = contratosCerrados.reduce((acc, c) => acc + c.volumenTon * c.precioAcordadoUSD, 0)
  const revenueUSD = gmvUSD * PLATFORM_FEE_RATE
  const plantasSinEudr = plantas.filter(p => p.ofertas.length > 0 && !p.ofertas.some(o => o.eudrVerificado)).length
  const diasEudr = diasHastaDeadlineEudr()

  const alertas = [
    plantasSinEudr > 0 && {
      icon: '🚨', color: 'red' as const,
      title: `${plantasSinEudr} planta${plantasSinEudr === 1 ? '' : 's'} sin EUDR — deadline en ${diasEudr} días`,
      meta: 'Ninguna de sus ofertas tiene DDS verificado',
    },
    vencidosRecientes > 0 && {
      icon: '⚠️', color: 'amber' as const,
      title: `${vencidosRecientes} certificación${vencidosRecientes === 1 ? '' : 'es'} ISCC venció recién`,
      meta: 'Se marcaron VENCIDO automáticamente en este chequeo',
    },
    contratosBorrador > 0 && {
      icon: '📋', color: 'amber' as const,
      title: `${contratosBorrador} contrato${contratosBorrador === 1 ? '' : 's'} FOSFA esperando confirmación`,
      meta: 'RFQ creado, falta que ambas partes confirmen',
    },
    empresasRecientes[0] && {
      icon: '✅', color: 'green' as const,
      title: `Última empresa registrada: ${empresasRecientes[0].razonSocial}`,
      meta: `${empresasRecientes[0].tipo} · ${empresasRecientes[0].provincia}`,
    },
  ].filter(Boolean) as { icon: string; color: 'red' | 'amber' | 'green'; title: string; meta: string }[]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#ede8dc' }}>
      <Sidebar role="ADMIN" nombre="Super Admin" provincia="BiodieselOS" />
      <main style={{ flex: 1 }}>
        <div style={{ background: '#fff', borderBottom: '1px solid rgba(13,26,20,0.1)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Panel de control — Plataforma</div>
            <div style={{ fontSize: 10, color: 'rgba(13,26,20,0.4)', marginTop: 2 }}>{totalUsuarios} empresas registradas · Sistema operativo</div>
          </div>
          <Badge text="● Sistema OK" color="green" />
        </div>

        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
            <KpiCard label="GMV total plataforma" value={`$${(gmvUSD / 1_000_000).toFixed(2)}M`} variant="green" sub="USD · contratos firmados+" />
            <KpiCard label="Revenue (fees)" value={`$${(revenueUSD / 1000).toFixed(0)}K`} variant="amber" sub={`Tasa ${(PLATFORM_FEE_RATE * 100).toFixed(1)}% (placeholder, TODO)`} />
            <KpiCard label="Proveedores activos" value={String(plantas.length)} variant="blue" sub="Plantas registradas" />
            <KpiCard label="Plantas sin EUDR" value={String(plantasSinEudr)} variant="red" sub={plantasSinEudr > 0 ? 'Acción urgente' : 'Todo en regla'} />
          </div>

          <div style={{ background: '#fff', border: '1px solid rgba(13,26,20,0.1)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(13,26,20,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Alertas del sistema</div>
              <Badge text={`${alertas.length} pendientes`} color="amber" />
            </div>
            <div style={{ padding: '8px 16px' }}>
              {alertas.length === 0 && (
                <div style={{ padding: 20, textAlign: 'center', fontSize: 12, color: 'rgba(13,26,20,0.4)' }}>Sin alertas activas.</div>
              )}
              {alertas.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(13,26,20,0.06)', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 20 }}>{a.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: 'rgba(13,26,20,0.4)', marginTop: 2 }}>{a.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
