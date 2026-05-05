export const PRECIOS_REFERENCIA = [
  { tipo: 'BIODIESEL_INTERNO', valor: 842500, moneda: 'ARS', fuente: 'SEC_ENERGIA' },
  { tipo: 'BIODIESEL_FOB',     valor: 1247,   moneda: 'USD', fuente: 'BOLSA_ROSARIO' },
  { tipo: 'SOJA_ACEITE',       valor: 923,    moneda: 'USD', fuente: 'BOLSA_ROSARIO' },
  { tipo: 'GASOIL_REF',        valor: 1180000, moneda: 'ARS', fuente: 'SEC_ENERGIA' },
]

export function formatearPrecio(valor: number, moneda: string): string {
  if (moneda === 'USD') return `$${valor.toLocaleString('es-AR')}`
  if (valor >= 1000000) return `$${(valor / 1000).toFixed(0)}K`
  return `$${(valor / 1000).toFixed(0)}K`
}

export const LABELS_PRECIO: Record<string, { nombre: string; subtipo: string }> = {
  BIODIESEL_INTERNO: { nombre: 'Biodiesel B100',   subtipo: 'MERCADO INTERNO · $/T' },
  BIODIESEL_FOB:     { nombre: 'Biodiesel Export',  subtipo: 'FOB ROSARIO · USD/T' },
  SOJA_ACEITE:       { nombre: 'Aceite de Soja',    subtipo: 'REFERENCIA INSUMO · USD/T' },
  GASOIL_REF:        { nombre: 'Gasoil Referencia', subtipo: 'BLEND REFERENCIA' },
}
