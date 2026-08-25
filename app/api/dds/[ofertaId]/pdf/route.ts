import { NextResponse } from 'next/server'
import { getSessionContext } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { generateDdsPdf } from '@/lib/pdf'

export async function GET(_request: Request, { params }: { params: { ofertaId: string } }) {
  const ctx = await getSessionContext()
  if (!ctx) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const dds = await prisma.ddsDocumento.findUnique({ where: { ofertaId: params.ofertaId } })
  if (!dds) return NextResponse.json({ error: 'DDS no encontrado' }, { status: 404 })

  const oferta = await prisma.oferta.findUnique({ where: { id: params.ofertaId } })
  if (!oferta) return NextResponse.json({ error: 'Oferta no encontrada' }, { status: 404 })

  const bytes = await generateDdsPdf({
    ofertaId: oferta.id,
    volumenTon: oferta.volumenTon,
    paisOrigen: dds.paisOrigen,
    fechaProduccion: dds.fechaProduccion,
    numeroReferencia: dds.numeroReferencia,
    geolocalizacion: dds.geolocalizacion,
  })

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="DDS-${oferta.id}.pdf"`,
    },
  })
}
