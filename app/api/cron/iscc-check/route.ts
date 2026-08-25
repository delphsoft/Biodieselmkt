import { NextResponse } from 'next/server'
import { checkAndExpireIscc } from '@/lib/iscc'

// Job diario (ver vercel.json) que vence certificaciones ISCC atrasadas.
// También corre on-read en los dashboards, así que este cron es un
// respaldo por si nadie visita la plataforma ese día.
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const vencidos = await checkAndExpireIscc()
  return NextResponse.json({ ok: true, certificacionesVencidas: vencidos })
}
