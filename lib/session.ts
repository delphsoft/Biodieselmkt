import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'
import type { Empresa } from '@prisma/client'

export type Role = 'ADMIN' | 'PROVEEDOR' | 'COMPRADOR'

export interface SessionContext {
  userId: string
  email: string
  role: Role
  empresa: Empresa | null
}

export const DASHBOARD_PATH: Record<Role, string> = {
  ADMIN: '/dashboard/admin',
  PROVEEDOR: '/dashboard/proveedor',
  COMPRADOR: '/dashboard/comprador',
}

// PLANTA vende biodiesel -> rol PROVEEDOR. El resto (PETROLERA, EXPORTADORA,
// DISTRIBUIDOR) compra -> rol COMPRADOR.
function roleFromTipo(tipo: string): Role {
  return tipo === 'PLANTA' ? 'PROVEEDOR' : 'COMPRADOR'
}

/**
 * Resuelve la sesión actual (usuario Supabase + rol + Empresa) contra Postgres
 * vía Prisma. Corre en runtime Node (Server Components/Route Handlers), por
 * eso el rol se resuelve acá de forma autoritativa desde la tabla Empresa —
 * el middleware (Edge runtime) no puede usar Prisma y solo hace un chequeo
 * rápido de sesión + un hint de rol desde user_metadata.
 */
export async function getSessionContext(): Promise<SessionContext | null> {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  // Los admins de la plataforma no tienen fila en Empresa: el rol se les
  // asigna a mano vía user_metadata.role = 'ADMIN' (Supabase dashboard / API admin).
  const metaRole = (user.user_metadata as { role?: string } | undefined)?.role
  if (metaRole === 'ADMIN') {
    return { userId: user.id, email: user.email ?? '', role: 'ADMIN', empresa: null }
  }

  const empresa = await prisma.empresa.findUnique({ where: { userId: user.id } })
  if (!empresa) return null // sesión válida pero el registro de Empresa no se completó

  return { userId: user.id, email: user.email ?? '', role: roleFromTipo(empresa.tipo), empresa }
}

/** Exige sesión + rol esperado. Redirige a /login o al dashboard que corresponda. */
export async function requireRole(expected: Role): Promise<SessionContext> {
  const ctx = await getSessionContext()
  if (!ctx) redirect('/login')
  if (ctx.role !== expected) redirect(DASHBOARD_PATH[ctx.role])
  return ctx
}
