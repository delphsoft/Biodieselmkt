'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// TODO: hoy la Carta de Porte se genera como PDF con datos cargados a mano.
// Falta integrar con el webservice de ARCA para la emisión oficial — ver
// también el comentario en prisma/schema.prisma sobre el modelo CartaDePorte.
const cartaSchema = z.object({
  contratoFosfaId: z.string().cuid(),
  cuitOrigen: z.string().trim().regex(/^\d{2}-?\d{8}-?\d{1}$/, 'CUIT origen inválido'),
  cuitDestino: z.string().trim().regex(/^\d{2}-?\d{8}-?\d{1}$/, 'CUIT destino inválido'),
  tipoCarga: z.string().trim().min(2, 'Tipo de carga requerido'),
  pesoKg: z.coerce.number().positive('El peso debe ser mayor a 0'),
  transportistaCuit: z.string().trim().regex(/^\d{2}-?\d{8}-?\d{1}$/, 'CUIT de transportista inválido'),
  transportistaNombre: z.string().trim().min(2, 'Nombre de transportista requerido'),
})

export async function crearCartaDePorte(formData: FormData) {
  const { empresa } = await requireRole('PROVEEDOR')

  const parsed = cartaSchema.safeParse({
    contratoFosfaId: formData.get('contratoFosfaId'),
    cuitOrigen: formData.get('cuitOrigen'),
    cuitDestino: formData.get('cuitDestino'),
    tipoCarga: formData.get('tipoCarga'),
    pesoKg: formData.get('pesoKg'),
    transportistaCuit: formData.get('transportistaCuit'),
    transportistaNombre: formData.get('transportistaNombre'),
  })
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? 'Datos inválidos')

  const contrato = await prisma.contratoFosfa.findUnique({
    where: { id: parsed.data.contratoFosfaId },
    include: { oferta: true },
  })
  if (!contrato || contrato.oferta.empresaId !== empresa!.id) throw new Error('Contrato no encontrado')
  if (contrato.status === 'BORRADOR') throw new Error('El contrato todavía no está firmado')

  const { cuitOrigen, cuitDestino, tipoCarga, pesoKg, transportistaCuit, transportistaNombre } = parsed.data
  const carta = await prisma.cartaDePorte.upsert({
    where: { contratoFosfaId: contrato.id },
    create: { contratoFosfaId: contrato.id, cuitOrigen, cuitDestino, tipoCarga, pesoKg, transportistaCuit, transportistaNombre },
    update: { cuitOrigen, cuitDestino, tipoCarga, pesoKg, transportistaCuit, transportistaNombre },
  })

  await prisma.cartaDePorte.update({
    where: { id: carta.id },
    data: { pdfUrl: `/api/carta-de-porte/${carta.id}/pdf` },
  })

  redirect(`/dashboard/proveedor/contratos/${contrato.id}`)
}
