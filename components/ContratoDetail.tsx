import { Badge } from '@/components/Badge'
import { actualizarTerminosContrato, confirmarContrato } from '@/app/actions/contratos'
import { INCOTERMS, type Clausula } from '@/lib/fosfa'
import type { ContratoFosfa, Empresa, Oferta, CartaDePorte } from '@prisma/client'

type ContratoConRelaciones = ContratoFosfa & {
  oferta: Oferta & { empresa: Empresa }
  comprador: Empresa
  cartaDePorte: CartaDePorte | null
}

const inputStyle = { width: '100%', padding: '9px 11px', border: '1px solid rgba(13,26,20,0.15)', borderRadius: 4, fontSize: 12, boxSizing: 'border-box' as const }
const labelStyle = { display: 'block', fontSize: 9, letterSpacing: '0.06em', color: 'rgba(13,26,20,0.5)', marginBottom: 5 }
const card = { background: '#fff', border: '1px solid rgba(13,26,20,0.1)', borderRadius: 8, padding: 18, marginBottom: 16 }

export function ContratoDetail({ contrato, role }: { contrato: ContratoConRelaciones; role: 'PROVEEDOR' | 'COMPRADOR' }) {
  const clausulas = (Array.isArray(contrato.clausulas) ? contrato.clausulas : []) as unknown as Clausula[]
  const miConfirmacion = role === 'PROVEEDOR' ? contrato.confirmadoProveedor : contrato.confirmadoComprador
  const otraConfirmacion = role === 'PROVEEDOR' ? contrato.confirmadoComprador : contrato.confirmadoProveedor
  const esBorrador = contrato.status === 'BORRADOR'

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700 }}>Contrato {contrato.numeroContrato}</h1>
          <div style={{ fontSize: 12, color: 'rgba(13,26,20,0.5)', marginTop: 4 }}>
            {contrato.oferta.empresa.razonSocial} → {contrato.comprador.razonSocial} · Lote #{contrato.ofertaId.slice(-6).toUpperCase()}
          </div>
        </div>
        <Badge
          text={contrato.status}
          color={contrato.status === 'FIRMADO' ? 'green' : contrato.status === 'BORRADOR' ? 'amber' : contrato.status === 'COMPLETADO' ? 'blue' : 'grey'}
        />
      </div>

      <div style={card}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Términos</div>
        <form action={actualizarTerminosContrato}>
          <input type="hidden" name="contratoId" value={contrato.id} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>INCOTERM</label>
              <select name="incoterm" defaultValue={contrato.incoterm} disabled={!esBorrador} style={inputStyle}>
                {INCOTERMS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>VOLUMEN (T)</label>
              <input name="volumenTon" type="number" step="0.01" defaultValue={contrato.volumenTon} disabled={!esBorrador} required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>PRECIO (USD/T)</label>
              <input name="precioAcordadoUSD" type="number" step="0.01" defaultValue={contrato.precioAcordadoUSD} disabled={!esBorrador} required style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>FECHA DE EMBARQUE — opcional</label>
            <input
              name="fechaEmbarque"
              type="date"
              disabled={!esBorrador}
              defaultValue={contrato.fechaEmbarque ? contrato.fechaEmbarque.toISOString().slice(0, 10) : ''}
              style={inputStyle}
            />
          </div>
          {esBorrador && (
            <button type="submit" style={{ background: '#1a3a28', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              Guardar términos
            </button>
          )}
        </form>
      </div>

      <div style={card}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Cláusulas FOSFA estándar</div>
        {clausulas.map(c => (
          <div key={c.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 0', fontSize: 12 }}>
            <span style={{ color: '#4a8c5c' }}>✓</span>
            <span>{c.label}</span>
          </div>
        ))}
      </div>

      {esBorrador && (
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Confirmación</div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12, fontSize: 12 }}>
            <Badge text={`Proveedor: ${contrato.confirmadoProveedor ? 'confirmado' : 'pendiente'}`} color={contrato.confirmadoProveedor ? 'green' : 'grey'} />
            <Badge text={`Comprador: ${contrato.confirmadoComprador ? 'confirmado' : 'pendiente'}`} color={contrato.confirmadoComprador ? 'green' : 'grey'} />
          </div>
          {miConfirmacion ? (
            <div style={{ fontSize: 12, color: 'rgba(13,26,20,0.5)' }}>
              Ya confirmaste. Esperando a que {otraConfirmacion ? '' : 'la otra parte confirme.'}
            </div>
          ) : (
            <form action={confirmarContrato}>
              <input type="hidden" name="contratoId" value={contrato.id} />
              <button type="submit" style={{ background: '#c8902a', color: '#0d1a14', border: 'none', borderRadius: 4, padding: '9px 18px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                Confirmar y firmar
              </button>
            </form>
          )}
        </div>
      )}

      {role === 'PROVEEDOR' && contrato.status !== 'BORRADOR' && (
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Carta de porte</div>
          {contrato.cartaDePorte ? (
            <a href={`/api/carta-de-porte/${contrato.cartaDePorte.id}/pdf`} target="_blank" style={{ fontSize: 12, color: '#1a4a7a', fontWeight: 600 }}>
              Descargar PDF →
            </a>
          ) : (
            <a href={`/dashboard/proveedor/contratos/${contrato.id}/carta-de-porte`} style={{ fontSize: 12, color: '#c8902a', fontWeight: 600 }}>
              Generar carta de porte →
            </a>
          )}
        </div>
      )}
    </>
  )
}
