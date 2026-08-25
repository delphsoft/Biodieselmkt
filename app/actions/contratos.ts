'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requireRole, getSessionContext } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { CLAUSULAS_FOSFA_DEFAULT, INCOTERMS } from '@/lib/fosfa'

const rfqSchema = z.object({
  ofertaId: z.string().cuid(),
  volumenTon: z.coerce.number().positive('El volumen debe ser mayor a 0'),
  precioAcordadoUSD: z.coerce.number().positive('El precio debe ser mayor a 0'),
  incoterm: z.enum(INCOTERMS),
})

/**
 * Flujo FOSFA — paso 1: el comprador hace un RFQ sobre una oferta activa.
 * Se materializa directo como ContratoFosfa en BORRADOR (no hay un modelo de
 * RFQ separado): el proveedor lo ve en /dashboard/proveedor/contratos y
 * puede editar términos antes de confirmar.
 */
export async function crearRfq(formData: FormData) {
  const { empresa } = await requireRole('COMPRADOR')

  const parsed = rfqSchema.safeParse({
    ofertaId: formData.get('ofertaId'),
    volumenTon: formData.get('volumenTon'),
    precioAcordadoUSD: formData.get('precioAcordadoUSD'),
    incoterm: formData.get('incoterm'),
  })
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? 'RFQ inválido')

  const oferta = await prisma.oferta.findUnique({ where: { id: parsed.data.ofertaId } })
  if (!oferta || oferta.status !== 'ACTIVA') throw new Error('La oferta ya no está disponible')

  const numeroContrato = `FOSFA-${new Date().getFullYear()}-${oferta.id.slice(-6).toUpperCase()}`

  const contrato = await prisma.$transaction(async tx => {
    const c = await tx.contratoFosfa.create({
      data: {
        ofertaId: oferta.id,
        numeroContrato,
        compradorId: empresa!.id,
        incoterm: parsed.data.incoterm,
        volumenTon: parsed.data.volumenTon,
        precioAcordadoUSD: parsed.data.precioAcordadoUSD,
        clausulas: CLAUSULAS_FOSFA_DEFAULT,
      },
    })
    await tx.oferta.update({ where: { id: oferta.id }, data: { status: 'EN_NEGOCIACION' } })
    return c
  })

  revalidatePath('/dashboard/comprador')
  redirect(`/dashboard/comprador/contratos/${contrato.id}`)
}

const terminosSchema = z.object({
  contratoId: z.string().cuid(),
  incoterm: z.enum(INCOTERMS),
  volumenTon: z.coerce.number().positive(),
  precioAcordadoUSD: z.coerce.number().positive(),
  fechaEmbarque: z.coerce.date().optional().or(z.literal('').transform(() => undefined)),
})

async function assertContratoAccess(contratoId: string) {
  const ctx = await getSessionContext()
  if (!ctx || ctx.role === 'ADMIN') throw new Error('No autorizado')

  const contrato = await prisma.contratoFosfa.findUnique({
    where: { id: contratoId },
    include: { oferta: true },
  })
  if (!contrato) throw new Error('Contrato no encontrado')

  const esComprador = ctx.role === 'COMPRADOR' && contrato.compradorId === ctx.empresa!.id
  const esProveedor = ctx.role === 'PROVEEDOR' && contrato.oferta.empresaId === ctx.empresa!.id
  if (!esComprador && !esProveedor) throw new Error('No autorizado')

  return { ctx, contrato }
}

/** Edita los términos mientras el contrato sigue en BORRADOR. Cualquier edición reabre la confirmación de ambas partes. */
export async function actualizarTerminosContrato(formData: FormData) {
  const parsed = terminosSchema.safeParse({
    contratoId: formData.get('contratoId'),
    incoterm: formData.get('incoterm'),
    volumenTon: formData.get('volumenTon'),
    precioAcordadoUSD: formData.get('precioAcordadoUSD'),
    fechaEmbarque: formData.get('fechaEmbarque'),
  })
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? 'Términos inválidos')

  const { contratoId, incoterm, volumenTon, precioAcordadoUSD, fechaEmbarque } = parsed.data
  const { contrato } = await assertContratoAccess(contratoId)
  if (contrato.status !== 'BORRADOR') throw new Error('El contrato ya fue firmado, no se puede editar')

  await prisma.contratoFosfa.update({
    where: { id: contratoId },
    data: { incoterm, volumenTon, precioAcordadoUSD, fechaEmbarque, confirmadoProveedor: false, confirmadoComprador: false },
  })

  revalidatePath(`/dashboard/proveedor/contratos/${contratoId}`)
  revalidatePath(`/dashboard/comprador/contratos/${contratoId}`)
}

/** Cada parte confirma los términos vigentes. Cuando ambas confirmaron, el contrato pasa a FIRMADO. */
export async function confirmarContrato(formData: FormData) {
  const contratoId = String(formData.get('contratoId'))
  const { ctx, contrato } = await assertContratoAccess(contratoId)
  if (contrato.status !== 'BORRADOR') throw new Error('El contrato ya fue firmado')

  const data = ctx.role === 'PROVEEDOR' ? { confirmadoProveedor: true } : { confirmadoComprador: true }
  const ambasConfirmadas =
    (ctx.role === 'PROVEEDOR' ? true : contrato.confirmadoProveedor) &&
    (ctx.role === 'COMPRADOR' ? true : contrato.confirmadoComprador)

  await prisma.$transaction(async tx => {
    await tx.contratoFosfa.update({
      where: { id: contratoId },
      data: ambasConfirmadas ? { ...data, status: 'FIRMADO' } : data,
    })
    if (ambasConfirmadas) {
      await tx.oferta.update({ where: { id: contrato.ofertaId }, data: { status: 'CERRADA' } })
    }
  })

  revalidatePath(`/dashboard/proveedor/contratos/${contratoId}`)
  revalidatePath(`/dashboard/comprador/contratos/${contratoId}`)
}
