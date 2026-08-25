import { NextResponse } from 'next/server'
import { getSessionContext } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { generateCartaDePortePdf } from '@/lib/pdf'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const ctx = await getSessionContext()
  if (!ctx) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const carta = await prisma.cartaDePorte.findUnique({ where: { id: params.id } })
  if (!carta) return NextResponse.json({ error: 'Carta de porte no encontrada' }, { status: 404 })

  const bytes = await generateCartaDePortePdf(carta)

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="carta-de-porte-${carta.id}.pdf"`,
    },
  })
}
