import { Sidebar } from '@/components/Sidebar'
import { KpiCard } from '@/components/KpiCard'
import { Badge } from '@/components/Badge'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { checkAndExpireIscc } from '@/lib/iscc'
import { matchearOfertas, type FiltrosComprador } from '@/lib/matching'
import { formatearPrecio } from '@/lib/precios'
import { INCOTERMS } from '@/lib/fosfa'
import { crearRfq } from '@/app/actions/contratos'

export default async function CompradorDashboard({ searchParams }: { searchParams: { iscc?: string; eudr?: string } }) {
  const { empresa } = await requireRole('COMPRADOR')
  await checkAndExpireIscc()

  const ofertasActivas = await prisma.oferta.findMany({
    where: { status: 'ACTIVA' },
    include: { empresa: true },
  })

  // Empresa no tiene lat/lng propia en el schema (solo la Oferta la tiene, del
  // lado del origen del lote), así que el score de logística usa el default
  // neutro de matchearOfertas cuando no hay ambas coordenadas.
  const filtros: FiltrosComprador = {
    requiereIscc: searchParams.iscc === '1',
    requiereEudr: searchParams.eudr === '1',
  }

  const matches = matchearOfertas(ofertasActivas, filtros).slice(0, 15)
  const empresaPorOferta = new Map(ofertasActivas.map(o => [o.id, o.empresa]))

  const conPrecio = ofertasActivas.filter(o => o.precioARS != null)
  const mejorPrecio = conPrecio.length > 0 ? Math.min(...conPrecio.map(o => o.precioARS!)) : null
  const isccCount = ofertasActivas.filter(o => o.isccActivo).length
  const eudrCount = ofertasActivas.filter(o => o.eudrVerificado).length

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#ede8dc' }}>
      <Sidebar role="COMPRADOR" nombre={empresa!.razonSocial} provincia={empresa!.provincia} />
      <main style={{ flex: 1 }}>
        <div style={{ background: '#fff', borderBottom: '1px solid rgba(13,26,20,0.1)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Buscar y comprar biodiesel</div>
            <div style={{ fontSize: 10, color: 'rgba(13,26,20,0.4)', marginTop: 2 }}>{ofertasActivas.length} ofertas disponibles{mejorPrecio ? ` · mejor precio: ${formatearPrecio(mejorPrecio, 'ARS')}/t` : ''}</div>
          </div>
        </div>

        <div style={{ padding: '20px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
            <KpiCard label="Ofertas activas" value={String(ofertasActivas.length)} variant="blue" sub="En el marketplace" />
            <KpiCard label="Mejor precio hoy" value={mejorPrecio ? `${formatearPrecio(mejorPrecio, 'ARS')}/t` : 'Sin datos'} variant="green" sub="Entre ofertas con precio cargado" />
            <KpiCard label="Ofertas ISCC verificadas" value={String(isccCount)} variant="amber" sub={`de ${ofertasActivas.length} totales`} />
            <KpiCard label="Ofertas EUDR verificadas" value={String(eudrCount)} variant="green" sub={`de ${ofertasActivas.length} totales`} />
          </div>

          <div style={{ background: '#fff', border: '1px solid rgba(13,26,20,0.1)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(13,26,20,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Ofertas disponibles — rankeadas por matching</div>
              <form method="get" style={{ display: 'flex', gap: 6 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input type="checkbox" name="iscc" value="1" defaultChecked={searchParams.iscc === '1'} />
                  <Badge text="Solo ISCC" color="green" />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input type="checkbox" name="eudr" value="1" defaultChecked={searchParams.eudr === '1'} />
                  <Badge text="Solo EUDR" color="blue" />
                </label>
                <button type="submit" style={{ fontSize: 10, border: '1px solid rgba(13,26,20,0.15)', borderRadius: 3, background: 'transparent', cursor: 'pointer', padding: '0 8px' }}>Filtrar</button>
              </form>
            </div>
            <div style={{ padding: 16 }}>
              {matches.length === 0 && (
                <div style={{ fontSize: 12, color: 'rgba(13,26,20,0.4)', textAlign: 'center', padding: 20 }}>
                  No hay ofertas activas que matcheen esos filtros.
                </div>
              )}
              {matches.map((m, i) => {
                const empresaOferente = empresaPorOferta.get(m.id)
                return (
                  <div key={m.id} style={{ border: `1px solid ${i === 0 ? '#c8902a' : 'rgba(13,26,20,0.1)'}`, background: i === 0 ? 'rgba(200,144,42,0.04)' : 'transparent', borderRadius: 6, padding: 14, marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{empresaOferente?.razonSocial ?? 'Planta'}</div>
                        <div style={{ fontSize: 11, color: 'rgba(13,26,20,0.4)', marginTop: 2 }}>📍 {empresaOferente?.provincia} · {m.volumenTon.toLocaleString('es-AR')} t · FAME {m.famePct}%</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 18, fontWeight: 800 }}>{m.precioARS ? formatearPrecio(m.precioARS, 'ARS') : 'Sin precio'}</div>
                        <div style={{ fontSize: 10, color: 'rgba(13,26,20,0.4)' }}>score {m.score}/100</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const, marginBottom: 10 }}>
                      {m.isccActivo && <Badge text="ISCC ✓" color="green" />}
                      {m.eudrVerificado ? <Badge text="EUDR ✓" color="green" /> : <Badge text="EUDR pendiente" color="amber" />}
                      <Badge text={`FAME ${m.famePct}%`} color="blue" />
                      <Badge text={m.tipoMercado} color="grey" />
                    </div>
                    <form action={crearRfq} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' as const }}>
                      <input type="hidden" name="ofertaId" value={m.id} />
                      <input name="volumenTon" type="number" step="0.01" defaultValue={m.volumenTon} required style={{ width: 90, padding: '6px 8px', fontSize: 11, border: '1px solid rgba(13,26,20,0.15)', borderRadius: 3 }} />
                      <input name="precioAcordadoUSD" type="number" step="0.01" placeholder="USD/t" required style={{ width: 90, padding: '6px 8px', fontSize: 11, border: '1px solid rgba(13,26,20,0.15)', borderRadius: 3 }} />
                      <select name="incoterm" defaultValue="FOB" style={{ padding: '6px 8px', fontSize: 11, border: '1px solid rgba(13,26,20,0.15)', borderRadius: 3 }}>
                        {INCOTERMS.map(inc => <option key={inc} value={inc}>{inc}</option>)}
                      </select>
                      <button type="submit" style={{ background: '#c8902a', border: 'none', borderRadius: 3, padding: '7px 14px', fontSize: 12, color: '#0d1a14', fontWeight: 700, cursor: 'pointer' }}>Hacer RFQ</button>
                    </form>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
