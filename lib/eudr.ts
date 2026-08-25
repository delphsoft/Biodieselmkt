// Deadline vinculante de la Regulation EU 2025/2650 para operadores grandes.
export const EUDR_DEADLINE = new Date('2026-12-30T00:00:00Z')

export function diasHastaDeadlineEudr(from: Date = new Date()): number {
  const ms = EUDR_DEADLINE.getTime() - from.getTime()
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)))
}

export function formatDiasRestantes(dias: number): string {
  return `${dias} d`
}
