import { Sidebar } from '@/components/Sidebar'
import { KpiCard } from '@/components/KpiCard'
import { Badge } from '@/components/Badge'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { checkAndExpireIscc } from '@/lib/iscc'
import { diasHastaDeadlineEudr, formatDiasRestantes } from '@/lib/eudr'
import { formatearPrecio } from '@/lib/precios'

export default async function ProveedorDashboard() {
  const { empresa } = await requireRole('PROVEEDOR')
  await checkAndExpireIscc()

  const [volumenAgg, ofertas, contratosActivos, precioSpot] = await Promise.all([
    prisma.oferta.aggregate({
      where: { empresaId: empresa!.id, status: 'ACTIVA' },
      _sum: { volumenTon: true },
    }),
    prisma.oferta.findMany({
      where: { empresaId: empresa!.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { certificacion: true, ddsDocumento: true, contratoFosfa: true },
    }),
    prisma.contratoFosfa.findMany({
      where: { oferta: { empresaId: empresa!.id }, status: { in: ['FIRMADO', 'EN_TRANSITO'] } },
      select: { volumenTon: true, precioAcordadoUSD: true },
    }),
    prisma.precioSpot.findFirst({ where: { tipo: 'BIODIESEL_INTERNO' }, orderBy: { fecha: 'desc' } }),
  ])

  const valorContratosUSD = contratosActivos.reduce((acc, c) => acc + c.volumenTon * c.precioAcordadoUSD, 0)
  const diasEudr = diasHastaDeadlineEudr()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#ede8dc' }}>
      <Sidebar role="PROVEEDOR" nombre={empresa!.razonSocial} provincia={empresa!.provincia} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: '#fff', borderBottom: '1px solid rgba(13,26,20,0.1)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Dashboard Proveedor</div>
            <div style={{ fontSize: 10, color: 'rgba(13,26,20,0.4)', marginTop: 2 }}>{empresa!.razonSocial} · CUIT {empresa!.cuit}</div>
          </div>
          <a href="/dashboard/proveedor/ofertas/nueva" style={{ background: '#c8902a', borderRadius: 3, padding: '8px 16px', fontSize: 11, color: '#0d1a14', fontWeight: 700, textDecoration: 'none' }}>
            + Nueva oferta
          </a>
        </div>

        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
            <KpiCard label="Volumen disponible" value={`${(volumenAgg._sum.volumenTon ?? 0).toLocaleString('es-AR')} t`} variant="green" sub="Ofertas activas" />
            <KpiCard
              label="Precio spot hoy"
              value={precioSpot ? formatearPrecio(precioSpot.valor, precioSpot.moneda) + '/t' : 'Sin datos'}
              variant="amber"
              sub={precioSpot ? `Fuente: ${precioSpot.fuente}` : 'Cargar en /dashboard/admin/precios'}
            />
            <KpiCard label="Contratos activos" value={String(contratosActivos.length)} variant="blue" sub={`$${(valorContratosUSD / 1000).toFixed(0)}K USD en curso`} />
            <KpiCard label="EUDR deadline" value={formatDiasRestantes(diasEudr)} variant={diasEudr < 60 ? 'red' : 'amber'} sub="30/12/2026 · Reg. EU 2025/2650" />
          </div>

          <div style={{ background: '#fff', border: '1px solid rgba(13,26,20,0.1)', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(13,26,20,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Mis ofertas</div>
              <Badge text={`${ofertas.length} totales`} color="green" />
            </div>
            <div style={{ padding: 16 }}>
              {ofertas.length === 0 && (
                <div style={{ fontSize: 12, color: 'rgba(13,26,20,0.4)', textAlign: 'center', padding: 20 }}>
                  Todavía no publicaste ninguna oferta. <a href="/dashboard/proveedor/ofertas/nueva" style={{ color: '#c8902a' }}>Crear la primera →</a>
                </div>
              )}
              {ofertas.map(o => (
                <a key={o.id} href={`/dashboard/proveedor/ofertas/${o.id}`} style={{ display: 'block', border: '1px solid rgba(13,26,20,0.1)', borderRadius: 6, padding: 14, marginBottom: 10, textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>Lote #{o.id.slice(-6).toUpperCase()}</div>
                      <div style={{ fontSize: 11, color: 'rgba(13,26,20,0.4)', marginTop: 2 }}>{o.volumenTon.toLocaleString('es-AR')} t · FAME {o.famePct}% · {o.tipoMercado}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 800 }}>{o.precioARS ? formatearPrecio(o.precioARS, 'ARS') : 'Sin precio'}</div>
                      <div style={{ fontSize: 10, color: 'rgba(13,26,20,0.4)' }}>por tonelada</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const }}>
                    {o.isccActivo && <Badge text="ISCC ✓" color="green" />}
                    {o.eudrVerificado ? <Badge text="EUDR ✓" color="green" /> : <Badge text="EUDR pendiente" color="amber" />}
                    <Badge
                      text={o.status === 'EN_NEGOCIACION' ? 'En negociación' : o.status === 'ACTIVA' ? 'Publicado' : o.status === 'CERRADA' ? 'Cerrado' : o.status}
                      color={o.status === 'EN_NEGOCIACION' ? 'amber' : o.status === 'ACTIVA' ? 'grey' : 'blue'}
                    />
                    {o.contratoFosfa && <Badge text={`Contrato ${o.contratoFosfa.status}`} color="blue" />}
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid rgba(13,26,20,0.1)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(13,26,20,0.08)' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Certificaciones</div>
            </div>
            <div style={{ padding: '8px 18px' }}>
              {ofertas.length === 0 && (
                <div style={{ fontSize: 12, color: 'rgba(13,26,20,0.4)', padding: '14px 0' }}>Sin ofertas todavía.</div>
              )}
              {ofertas.map(o => (
                <div key={o.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(13,26,20,0.06)' }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>ISCC EU — Lote #{o.id.slice(-6).toUpperCase()}</div>
                      <div style={{ fontSize: 11, color: 'rgba(13,26,20,0.4)' }}>
                        {o.certificacion ? `Vence ${o.certificacion.fechaVencimiento.toLocaleDateString('es-AR')}` : 'Sin certificado cargado'}
                      </div>
                    </div>
                    <Badge text={o.certificacion?.status ?? 'Sin cargar'} color={o.certificacion?.status === 'ACTIVO' ? 'green' : o.certificacion?.status === 'VENCIDO' ? 'red' : 'grey'} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(13,26,20,0.06)' }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>EUDR – DDS Lote #{o.id.slice(-6).toUpperCase()}</div>
                      <div style={{ fontSize: 11, color: 'rgba(13,26,20,0.4)' }}>{o.ddsDocumento ? o.ddsDocumento.paisOrigen : 'Pendiente de carga'}</div>
                    </div>
                    <Badge text={o.ddsDocumento?.status ?? 'Pendiente'} color={o.ddsDocumento?.status === 'GENERADO' || o.ddsDocumento?.status === 'VERIFICADO' ? 'green' : 'amber'} />
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
