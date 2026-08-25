/** @type {import('next').NextConfig} */
const nextConfig = {
  // Antes en true: dejaba pasar builds con errores de tipos reales (ver
  // fixes de app/actions/*.ts). Ahora el build falla si tsc encuentra algo.
  typescript: { ignoreBuildErrors: false },
  // No hay config de ESLint en el repo todavía (`next lint` pide setearla
  // interactivamente) — se deja en true hasta que se configure explícitamente.
  eslint: { ignoreDuringBuilds: true },
}

module.exports = nextConfig
