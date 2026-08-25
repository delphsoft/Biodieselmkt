'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/prisma'

const isccSchema = z.object({
  ofertaId: z.string().cuid(),
  numeroCertificado: z.string().trim().min(3, 'Número de certificado requerido'),
  fechaVencimiento: z.coerce.date({ errorMap: () => ({ message: 'Fecha de vencimiento inválida' }) }),
})

export async function guardarCertificacionIscc(formData: FormData) {
  const { empresa } = await requireRole('PROVEEDOR')

  const parsed = isccSchema.safeParse({
    ofertaId: formData.get('ofertaId'),
    numeroCertificado: formData.get('numeroCertificado'),
    fechaVencimiento: formData.get('fechaVencimiento'),
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Datos de certificación inválidos')
  }

  const { ofertaId, numeroCertificado, fechaVencimiento } = parsed.data
  const oferta = await prisma.oferta.findFirst({ where: { id: ofertaId, empresaId: empresa!.id } })
  if (!oferta) throw new Error('Oferta no encontrada')

  const activo = fechaVencimiento.getTime() > Date.now()
  const status = activo ? 'ACTIVO' : 'VENCIDO'

  await prisma.$transaction([
    prisma.certificacionISCC.upsert({
      where: { ofertaId },
      create: { ofertaId, numeroCertificado, fechaVencimiento, status },
      update: { numeroCertificado, fechaVencimiento, status },
    }),
    prisma.oferta.update({ where: { id: ofertaId }, data: { isccActivo: activo } }),
  ])

  revalidatePath(`/dashboard/proveedor/ofertas/${ofertaId}`)
  revalidatePath('/dashboard/proveedor')
}
