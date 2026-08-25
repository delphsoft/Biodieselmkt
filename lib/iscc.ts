import { prisma } from '@/lib/prisma'

/**
 * Chequeo on-read del vencimiento de certificaciones ISCC: cualquier
 * certificado ACTIVO cuya fechaVencimiento ya pasó se marca VENCIDO y su
 * Oferta asociada pasa isccActivo=false. Se llama al cargar los dashboards
 * (proveedor/comprador/admin) y también está expuesto como cron diario en
 * /api/cron/iscc-check (ver vercel.json) para no depender solo de que
 * alguien visite un dashboard.
 */
export async function checkAndExpireIscc(): Promise<number> {
  const vencidos = await prisma.certificacionISCC.findMany({
    where: { status: 'ACTIVO', fechaVencimiento: { lt: new Date() } },
    select: { id: true, ofertaId: true },
  })

  if (vencidos.length === 0) return 0

  await prisma.$transaction([
    prisma.certificacionISCC.updateMany({
      where: { id: { in: vencidos.map(v => v.id) } },
      data: { status: 'VENCIDO' },
    }),
    prisma.oferta.updateMany({
      where: { id: { in: vencidos.map(v => v.ofertaId) } },
      data: { isccActivo: false },
    }),
  ])

  return vencidos.length
}
