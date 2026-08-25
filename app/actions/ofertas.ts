'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/prisma'

const ofertaSchema = z.object({
  volumenTon: z.coerce.number().positive('El volumen debe ser mayor a 0'),
  famePct: z.coerce.number().min(0).max(100, 'FAME % debe estar entre 0 y 100'),
  precioARS: z.coerce.number().positive().optional().or(z.literal('').transform(() => undefined)),
  tipoMercado: z.enum(['INTERNO', 'EXPORT']),
  lat: z.coerce.number().optional().or(z.literal('').transform(() => undefined)),
  lng: z.coerce.number().optional().or(z.literal('').transform(() => undefined)),
})

export async function crearOferta(formData: FormData) {
  const { empresa } = await requireRole('PROVEEDOR')

  const parsed = ofertaSchema.safeParse({
    volumenTon: formData.get('volumenTon'),
    famePct: formData.get('famePct'),
    precioARS: formData.get('precioARS'),
    tipoMercado: formData.get('tipoMercado'),
    lat: formData.get('lat'),
    lng: formData.get('lng'),
  })

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Datos de oferta inválidos')
  }

  const { volumenTon, famePct, precioARS, tipoMercado, lat, lng } = parsed.data
  const oferta = await prisma.oferta.create({
    data: { volumenTon, famePct, precioARS, tipoMercado, lat, lng, empresaId: empresa!.id },
  })

  revalidatePath('/dashboard/proveedor')
  redirect(`/dashboard/proveedor/ofertas/${oferta.id}`)
}
