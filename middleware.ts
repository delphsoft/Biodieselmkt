import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const DASHBOARD_PATH: Record<string, string> = {
  ADMIN: '/dashboard/admin',
  PROVEEDOR: '/dashboard/proveedor',
  COMPRADOR: '/dashboard/comprador',
}

/**
 * Corre en el Edge runtime, así que no puede usar Prisma (necesita TCP a
 * Postgres). Acá solo se hace el gate de sesión + un hint de rol rápido
 * desde el JWT (user_metadata). El chequeo autoritativo por rol contra la
 * tabla Empresa vive en lib/session.ts (requireRole), que corren los
 * Server Components de cada dashboard en runtime Node.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request: { headers: request.headers } })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  const metaRole = (user.user_metadata as { role?: string } | undefined)?.role
  if (metaRole && DASHBOARD_PATH[metaRole] && !request.nextUrl.pathname.startsWith(DASHBOARD_PATH[metaRole])) {
    // Solo redirigimos cuando el hint de metadata es explícito (hoy: ADMIN).
    // Proveedor/comprador se resuelven server-side contra Empresa porque acá
    // no tenemos ese dato todavía.
    if (metaRole === 'ADMIN') {
      return NextResponse.redirect(new URL(DASHBOARD_PATH.ADMIN, request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
