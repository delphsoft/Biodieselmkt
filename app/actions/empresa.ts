'use server'

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { prisma } from '@/lib/prisma'
import { empresaSchema } from '@/lib/validation'

/**
 * Llamado desde /auth/callback justo después de confirmar el magic link de
 * registro. Los datos cargados en el formulario de /register viajaron en
 * user_metadata (vía options.data de signInWithOtp) porque en ese momento
 * todavía no hay sesión ni auth.uid() disponible. Acá, con sesión ya
 * establecida, los validamos con Zod y creamos la fila Empresa definitiva.
 *
 * Es idempotente: si la Empresa ya existe para este userId, la devuelve tal
 * cual (cubre el caso de un usuario que ya se registró y hace login normal).
 */
export async function ensureEmpresaFromSession() {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const existing = await prisma.empresa.findUnique({ where: { userId: user.id } })
  if (existing) return existing

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>
  const parsed = empresaSchema.safeParse({
    cuit: meta.cuit,
    razonSocial: meta.razonSocial,
    tipo: meta.tipo,
    provincia: meta.provincia,
  })

  // Login normal (sin datos de registro en metadata) o metadata corrupta:
  // no hay Empresa que crear todavía. El caller decide qué mostrar.
  if (!parsed.success) return null

  const { cuit, razonSocial, tipo, provincia } = parsed.data

  try {
    return await prisma.empresa.create({ data: { cuit, razonSocial, tipo, provincia, userId: user.id } })
  } catch (err: any) {
    // CUIT duplicado (unique constraint) — probablemente el usuario ya se
    // registró antes con otra cuenta de email.
    if (err?.code === 'P2002') return null
    throw err
  }
}
