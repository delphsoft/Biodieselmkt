import { notFound } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { ContratoDetail } from '@/components/ContratoDetail'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export default async function CompradorContratoDetailPage({ params }: { params: { id: string } }) {
  const { empresa } = await requireRole('COMPRADOR')

  const contrato = await prisma.contratoFosfa.findFirst({
    where: { id: params.id, compradorId: empresa!.id },
    include: { oferta: { include: { empresa: true } }, comprador: true, cartaDePorte: true },
  })
  if (!contrato) notFound()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#ede8dc' }}>
      <Sidebar role="COMPRADOR" nombre={empresa!.razonSocial} provincia={empresa!.provincia} />
      <main style={{ flex: 1, padding: '24px 32px', maxWidth: 620 }}>
        <ContratoDetail contrato={contrato} role="COMPRADOR" />
      </main>
    </div>
  )
}
