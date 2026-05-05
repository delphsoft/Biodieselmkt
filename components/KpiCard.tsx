interface Props {
  label: string
  value: string
  sub?: string
  variant: 'green' | 'amber' | 'blue' | 'red'
}

const COLORS = {
  green: '#4a8c5c',
  amber: '#c8902a',
  blue:  '#1a4a7a',
  red:   '#c0392b',
}

export function KpiCard({ label, value, sub, variant }: Props) {
  return (
    <div style={{
      background: '#fff', border: '1px solid rgba(13,26,20,0.1)',
      borderRadius: 8, padding: 16, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: COLORS[variant] }} />
      <div style={{ fontSize: 9, letterSpacing: '0.08em', color: 'rgba(13,26,20,0.4)', textTransform: 'uppercase' as const, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: '#0d1a14', lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 10, color: 'rgba(13,26,20,0.4)', marginTop: 5 }}>{sub}</div>}
    </div>
  )
}
