import { PrismaClient } from '@prisma/client'

// Singleton estándar de Next.js para evitar agotar conexiones en dev
// (hot-reload crea múltiples instancias si no se cachea en globalThis).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
