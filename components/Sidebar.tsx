'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  href: string
  icon: string
  label: string
  badge?: string
}

const NAV_PROVEEDOR: NavItem[] = [
  { href: '/dashboard/proveedor',                icon: '📊', label: 'Dashboard' },
  { href: '/dashboard/proveedor/ofertas',         icon: '📦', label: 'Mis Ofertas' },
  { href: '/dashboard/proveedor/contratos',       icon: '📋', label: 'Contratos' },
  { href: '/dashboard/proveedor/eudr',            icon: '🌍', label: 'EUDR / Trazabilidad' },
  { href: '/dashboard/proveedor/certificaciones', icon: '🏆', label: 'Certificaciones' },
  { href: '/dashboard/proveedor/finanzas',        icon: '💰', label: 'Liquidaciones' },
  { href: '/precios',                             icon: '📈', label: 'Precios mercado' },
]

const NAV_COMPRADOR: NavItem[] = [
  { href: '/dashboard/comprador',            icon: '🔍', label: 'Buscar oferta' },
  { href: '/dashboard/comprador/contratos',  icon: '📋', label: 'Mis contratos' },
  { href: '/dashboard/comprador/compliance', icon: '✅', label: 'Corte regulatorio' },
  { href: '/precios',                        icon: '📈', label: 'Precios live' },
]

const NAV_ADMIN: NavItem[] = [
  { href: '/dashboard/admin',               icon: '📊', label: 'Overview' },
  { href: '/dashboard/admin/usuarios',      icon: '👥', label: 'Usuarios', badge: '4' },
  { href: '/dashboard/admin/contratos',     icon: '📋', label: 'Contratos' },
  { href: '/dashboard/admin/eudr',          icon: '🌍', label: 'EUDR Monitor' },
  { href: '/dashboard/admin/transacciones', icon: '💰', label: 'Transacciones' },
  { href: '/dashboard/admin/precios',       icon: '💲', label: 'Precios spot' },
]

interface Props {
  role: 'PROVEEDOR' | 'COMPRADOR' | 'ADMIN'
  nombre: string
  provincia: string
}

export function Sidebar({ role, nombre, provincia }: Props) {
  const pathname = usePathname()
  const nav = role === 'PROVEEDOR' ? NAV_PROVEEDOR : role === 'COMPRADOR' ? NAV_COMPRADOR : NAV_ADMIN
  const initials = nombre.split(' ').map(w => w[0]).slice(0, 2).join('')

  return (
    <aside style={{ background: '#1a3a28', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(0,0,0,0.15)', minHeight: '100vh', width: 220 }}>
      <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 28, height: 28, background: '#c8902a', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#0d1a14' }}>B●</div>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Biodiesel<span style={{ color: '#c8902a' }}>OS</span></span>
      </div>

      <div style={{ padding: '10px 20px', fontSize: 9, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' as const }}>
        Panel {role.charAt(0) + role.slice(1).toLowerCase()}
      </div>

      {nav.map(item => {
        const active = pathname === item.href
        return (
          <Link key={item.href} href={item.href} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '9px 20px',
            fontSize: 13, color: active ? '#fff' : 'rgba(255,255,255,0.5)',
            background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
            borderLeft: `3px solid ${active ? '#c8902a' : 'transparent'}`,
            fontWeight: active ? 500 : 400, textDecoration: 'none',
          }}>
            <span style={{ fontSize: 15, width: 18, textAlign: 'center' as const }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge && (
              <span style={{ background: '#c8902a', color: '#0d1a14', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 10 }}>
                {item.badge}
              </span>
            )}
          </Link>
        )
      })}

      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '12px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#2d5a3d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#8fbf9f', fontWeight: 500 }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#fff' }}>{nombre.slice(0, 22)}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{provincia}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
