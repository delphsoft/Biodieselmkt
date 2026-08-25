import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Seed inicial de precios spot — reemplaza los valores que antes estaban
// hardcodeados en lib/precios.ts / app/api/precios/route.ts. Son el punto de
// partida hasta que un admin los actualice desde /dashboard/admin/precios.
const SEED_PRECIOS = [
  { tipo: 'BIODIESEL_INTERNO', valor: 842500, moneda: 'ARS', fuente: 'SEC_ENERGIA' },
  { tipo: 'BIODIESEL_FOB', valor: 1247, moneda: 'USD', fuente: 'BOLSA_ROSARIO' },
  { tipo: 'SOJA_ACEITE', valor: 923, moneda: 'USD', fuente: 'BOLSA_ROSARIO' },
  { tipo: 'GASOIL_REF', valor: 1180000, moneda: 'ARS', fuente: 'SEC_ENERGIA' },
]

async function main() {
  for (const precio of SEED_PRECIOS) {
    const existe = await prisma.precioSpot.findFirst({ where: { tipo: precio.tipo } })
    if (!existe) await prisma.precioSpot.create({ data: precio })
  }
  console.log(`Seed OK — ${SEED_PRECIOS.length} tipos de precio verificados/creados.`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
