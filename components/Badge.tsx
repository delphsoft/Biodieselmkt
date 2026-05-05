type Color = 'green' | 'amber' | 'blue' | 'grey' | 'red'

const STYLES: Record<Color, { bg: string; color: string }> = {
  green: { bg: 'rgba(74,140,92,0.12)',  color: '#2e7d32' },
  amber: { bg: 'rgba(200,144,42,0.12)', color: '#c8902a' },
  blue:  { bg: 'rgba(26,74,122,0.1)',   color: '#1a4a7a' },
  grey:  { bg: 'rgba(13,26,20,0.08)',   color: 'rgba(13,26,20,0.5)' },
  red:   { bg: 'rgba(192,57,43,0.1)',   color: '#c0392b' },
}

export function Badge({ text, color }: { text: string; color: Color }) {
  const s = STYLES[color]
  return (
    <span style={{
      fontSize: 9, letterSpacing: '0.05em', padding: '3px 8px',
      borderRadius: 20, fontWeight: 500,
      background: s.bg, color: s.color, display: 'inline-block',
    }}>{text}</span>
  )
}
