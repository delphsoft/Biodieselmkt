import { redirect } from 'next/navigation'
import { getSessionContext, DASHBOARD_PATH } from '@/lib/session'

// Landing neutral de /dashboard: resuelve el rol de la sesión y redirige
// al panel que corresponde. Es el destino por defecto que usa el callback
// de Supabase cuando no hay un `redirectTo` explícito.
export default async function DashboardIndex() {
  const ctx = await getSessionContext()
  if (!ctx) redirect('/login')
  redirect(DASHBOARD_PATH[ctx.role])
}
