import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { ensureEmpresaFromSession } from '@/app/actions/empresa'

// Endpoint al que Supabase redirige después de que el usuario clickea el
// magic link (login u registro). Intercambia el `code` PKCE por una sesión,
// completa el registro de Empresa si corresponde, y manda al dashboard.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('redirectTo')

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const empresa = await ensureEmpresaFromSession()

      if (redirectTo) return NextResponse.redirect(`${origin}${redirectTo}`)

      if (empresa) {
        const dest = empresa.tipo === 'PLANTA' ? '/dashboard/proveedor' : '/dashboard/comprador'
        return NextResponse.redirect(`${origin}${dest}`)
      }

      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
