'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// TODO: no hay confirmación de una fuente pública con API estable para
// Bolsa Rosario / Sec. Energía todavía. Hasta que se defina, los precios
// spot se cargan a mano acá por un admin — no se simulan como automáticos.
const precioSchema = z.object({
  tipo: z.string().trim().min(2),
  valor: z.coerce.number().positive('El valor debe ser mayor a 0'),
  moneda: z.enum(['ARS', 'USD']),
  fuente: z.string().trim().min(2),
})

export async function actualizarPrecioSpot(formData: FormData) {
  await requireRole('ADMIN')

  const parsed = precioSchema.safeParse({
    tipo: formData.get('tipo'),
    valor: formData.get('valor'),
    moneda: formData.get('moneda'),
    fuente: formData.get('fuente'),
  })
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? 'Precio inválido')

  const { tipo, valor, moneda, fuente } = parsed.data
  await prisma.precioSpot.create({ data: { tipo, valor, moneda, fuente } })

  revalidatePath('/dashboard/admin/precios')
  revalidatePath('/precios')
}
