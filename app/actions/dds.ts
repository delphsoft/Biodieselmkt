'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/prisma'

const ddsSchema = z.object({
  ofertaId: z.string().cuid(),
  paisOrigen: z.string().trim().min(2, 'País de origen requerido'),
  fechaProduccion: z.coerce.date({ errorMap: () => ({ message: 'Fecha de producción inválida' }) }),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  numeroReferencia: z.string().trim().optional().or(z.literal('').transform(() => undefined)),
})

/**
 * Carga geolocalización + fecha de producción para el DDS de una oferta y
 * lo marca GENERADO. El PDF en sí se genera on-demand en
 * /api/dds/[ofertaId]/pdf (no se persiste el binario — no hay storage
 * configurado todavía; ver TODO en el modelo DdsDocumento).
 */
export async function guardarDds(formData: FormData) {
  const { empresa } = await requireRole('PROVEEDOR')

  const parsed = ddsSchema.safeParse({
    ofertaId: formData.get('ofertaId'),
    paisOrigen: formData.get('paisOrigen'),
    fechaProduccion: formData.get('fechaProduccion'),
    lat: formData.get('lat'),
    lng: formData.get('lng'),
    numeroReferencia: formData.get('numeroReferencia'),
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Datos de DDS inválidos')
  }

  const { ofertaId, lat, lng, paisOrigen, fechaProduccion, numeroReferencia } = parsed.data

  // Solo el dueño de la oferta puede cargar su DDS.
  const oferta = await prisma.oferta.findFirst({ where: { id: ofertaId, empresaId: empresa!.id } })
  if (!oferta) throw new Error('Oferta no encontrada')

  const geolocalizacion = { type: 'Point', coordinates: [lng, lat] }

  await prisma.$transaction([
    prisma.ddsDocumento.upsert({
      where: { ofertaId },
      create: {
        ofertaId,
        paisOrigen,
        fechaProduccion,
        numeroReferencia,
        geolocalizacion,
        status: 'GENERADO',
        pdfUrl: `/api/dds/${ofertaId}/pdf`,
      },
      update: {
        paisOrigen,
        fechaProduccion,
        numeroReferencia,
        geolocalizacion,
        status: 'GENERADO',
        pdfUrl: `/api/dds/${ofertaId}/pdf`,
      },
    }),
    prisma.oferta.update({ where: { id: ofertaId }, data: { eudrVerificado: true } }),
  ])

  revalidatePath(`/dashboard/proveedor/ofertas/${ofertaId}`)
  revalidatePath('/dashboard/proveedor')
}
