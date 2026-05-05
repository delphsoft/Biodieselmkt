export interface FiltrosComprador {
  volumenMinTon?: number
  volumenMaxTon?: number
  fameMinPct?: number
  requiereIscc?: boolean
  requiereEudr?: boolean
  tipoMercado?: string
  latComprador?: number
  lngComprador?: number
}

export interface OfertaParaMatch {
  id: string
  volumenTon: number
  famePct: number
  precioARS?: number | null
  tipoMercado: string
  isccActivo: boolean
  eudrVerificado: boolean
  lat?: number | null
  lng?: number | null
}

export interface OfertaConScore extends OfertaParaMatch {
  score: number
  scoreDetalle: {
    calidad: number
    precio: number
    logistica: number
    certificacion: number
  }
}

function distanciaKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function calcularScore(
  oferta: OfertaParaMatch,
  filtros: FiltrosComprador,
  precioReferencia = 842000
): OfertaConScore {
  // Calidad FAME (0-30 pts)
  let calidad = 0
  if (oferta.famePct >= 98.5)      calidad = 30
  else if (oferta.famePct >= 98.0) calidad = 26
  else if (oferta.famePct >= 97.5) calidad = 20
  else if (oferta.famePct >= 97.0) calidad = 14
  else                             calidad = 5

  // Precio vs mercado (0-35 pts)
  let precio = 0
  const precioEfectivo = oferta.precioARS ?? precioReferencia
  const descuento = (precioReferencia - precioEfectivo) / precioReferencia
  if (descuento >= 0.02)       precio = 35
  else if (descuento >= 0.01)  precio = 28
  else if (descuento >= 0)     precio = 22
  else if (descuento >= -0.01) precio = 15
  else if (descuento >= -0.02) precio = 8
  else                         precio = 3

  // Logística / distancia (0-20 pts)
  let logistica = 10
  if (filtros.latComprador && filtros.lngComprador && oferta.lat && oferta.lng) {
    const km = distanciaKm(filtros.latComprador, filtros.lngComprador, oferta.lat, oferta.lng)
    if (km <= 100)       logistica = 20
    else if (km <= 300)  logistica = 16
    else if (km <= 500)  logistica = 12
    else if (km <= 800)  logistica = 8
    else if (km <= 1200) logistica = 4
    else                 logistica = 1
  }

  // Certificación (0-15 pts)
  let certificacion = 0
  if (oferta.isccActivo)    certificacion += 8
  if (oferta.eudrVerificado) certificacion += 7

  const score = Math.min(100, calidad + precio + logistica + certificacion)
  return { ...oferta, score, scoreDetalle: { calidad, precio, logistica, certificacion } }
}

export function matchearOfertas(
  ofertas: OfertaParaMatch[],
  filtros: FiltrosComprador,
  precioRef?: number
): OfertaConScore[] {
  return ofertas
    .filter(o => {
      if (filtros.volumenMinTon && o.volumenTon < filtros.volumenMinTon) return false
      if (filtros.volumenMaxTon && o.volumenTon > filtros.volumenMaxTon) return false
      if (filtros.fameMinPct && o.famePct < filtros.fameMinPct) return false
      if (filtros.requiereIscc && !o.isccActivo) return false
      if (filtros.requiereEudr && !o.eudrVerificado) return false
      return true
    })
    .map(o => calcularScore(o, filtros, precioRef))
    .sort((a, b) => b.score - a.score)
}
