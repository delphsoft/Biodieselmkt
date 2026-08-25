import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TODO: no hay confirmación de una fuente pública con API estable para
// Bolsa Rosario / Sec. Energía. Hasta que se defina una integración
// automatizada, estos valores se cargan a mano desde /dashboard/admin/precios
// — no son "en vivo", son el último valor que un admin publicó.
export async function GET() {
  const tipos = ['BIODIESEL_INTERNO', 'BIODIESEL_FOB', 'SOJA_ACEITE', 'GASOIL_REF']

  const ultimos = await Promise.all(
    tipos.map(tipo => prisma.precioSpot.findFirst({ where: { tipo }, orderBy: { fecha: 'desc' } }))
  )

  return NextResponse.json({ ok: true, data: ultimos.filter(Boolean) })
}
