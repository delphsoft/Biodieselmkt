import { Sidebar } from '@/components/Sidebar'
import { Badge } from '@/components/Badge'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export default async function CompradorContratosPage() {
  const { empresa } = await requireRole('COMPRADOR')

  const contratos = await prisma.contratoFosfa.findMany({
    where: { compradorId: empresa!.id },
    include: { oferta: { include: { empresa: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#ede8dc' }}>
      <Sidebar role="COMPRADOR" nombre={empresa!.razonSocial} provincia={empresa!.provincia} />
      <main style={{ flex: 1, padding: '24px 32px' }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Mis contratos</h1>

        <div style={{ background: '#fff', border: '1px solid rgba(13,26,20,0.1)', borderRadius: 8, overflow: 'hidden' }}>
          {contratos.length === 0 && (
            <div style={{ padding: 24, fontSize: 12, color: 'rgba(13,26,20,0.4)', textAlign: 'center' }}>
              Sin contratos todavía. Hacé un RFQ desde <a href="/dashboard/comprador" style={{ color: '#c8902a' }}>Buscar oferta</a>.
            </div>
          )}
          {contratos.map(c => (
            <a key={c.id} href={`/dashboard/comprador/contratos/${c.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid rgba(13,26,20,0.06)', textDecoration: 'none', color: 'inherit' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{c.numeroContrato}</div>
                <div style={{ fontSize: 11, color: 'rgba(13,26,20,0.4)', marginTop: 2 }}>{c.oferta.empresa.razonSocial} · {c.volumenTon.toLocaleString('es-AR')} t · {c.incoterm}</div>
              </div>
              <Badge text={c.status} color={c.status === 'FIRMADO' ? 'green' : c.status === 'BORRADOR' ? 'amber' : 'blue'} />
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}
