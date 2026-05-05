import { NextResponse } from 'next/server'

const PRECIOS = [
  { tipo: 'BIODIESEL_INTERNO', valor: 842500, moneda: 'ARS', fuente: 'SEC_ENERGIA' },
  { tipo: 'BIODIESEL_FOB',     valor: 1247,   moneda: 'USD', fuente: 'BOLSA_ROSARIO' },
  { tipo: 'SOJA_ACEITE',       valor: 923,    moneda: 'USD', fuente: 'BOLSA_ROSARIO' },
  { tipo: 'GASOIL_REF',        valor: 1180000, moneda: 'ARS', fuente: 'SEC_ENERGIA' },
]

export async function GET() {
  return NextResponse.json({ ok: true, data: PRECIOS })
}
