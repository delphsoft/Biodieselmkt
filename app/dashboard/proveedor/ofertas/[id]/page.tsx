import { notFound } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { Badge } from '@/components/Badge'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { guardarDds } from '@/app/actions/dds'
import { guardarCertificacionIscc } from '@/app/actions/iscc'
import { formatearPrecio } from '@/lib/precios'

const inputStyle = { width: '100%', padding: '9px 11px', border: '1px solid rgba(13,26,20,0.15)', borderRadius: 4, fontSize: 12, boxSizing: 'border-box' as const }
const labelStyle = { display: 'block', fontSize: 9, letterSpacing: '0.06em', color: 'rgba(13,26,20,0.5)', marginBottom: 5 }
const card = { background: '#fff', border: '1px solid rgba(13,26,20,0.1)', borderRadius: 8, padding: 18, marginBottom: 16 }

export default async function OfertaDetailPage({ params }: { params: { id: string } }) {
  const { empresa } = await requireRole('PROVEEDOR')

  const oferta = await prisma.oferta.findFirst({
    where: { id: params.id, empresaId: empresa!.id },
    include: { certificacion: true, ddsDocumento: true, contratoFosfa: true },
  })
  if (!oferta) notFound()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#ede8dc' }}>
      <Sidebar role="PROVEEDOR" nombre={empresa!.razonSocial} provincia={empresa!.provincia} />
      <main style={{ flex: 1, padding: '24px 32px', maxWidth: 620 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700 }}>Lote #{oferta.id.slice(-6).toUpperCase()}</h1>
            <div style={{ fontSize: 12, color: 'rgba(13,26,20,0.5)', marginTop: 4 }}>
              {oferta.volumenTon.toLocaleString('es-AR')} t · FAME {oferta.famePct}% · {oferta.tipoMercado} · {oferta.precioARS ? formatearPrecio(oferta.precioARS, 'ARS') + '/t' : 'sin precio'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {oferta.isccActivo && <Badge text="ISCC ✓" color="green" />}
            {oferta.eudrVerificado ? <Badge text="EUDR ✓" color="green" /> : <Badge text="EUDR pendiente" color="amber" />}
          </div>
        </div>

        {oferta.contratoFosfa && (
          <div style={{ ...card, borderColor: '#c8902a' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Contrato FOSFA {oferta.contratoFosfa.numeroContrato}</div>
            <div style={{ fontSize: 12, color: 'rgba(13,26,20,0.5)', marginBottom: 10 }}>Estado: {oferta.contratoFosfa.status}</div>
            <a href={`/dashboard/proveedor/contratos/${oferta.contratoFosfa.id}`} style={{ fontSize: 12, color: '#c8902a', fontWeight: 600 }}>Ver contrato →</a>
          </div>
        )}

        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Certificación ISCC</div>
          <form action={guardarCertificacionIscc}>
            <input type="hidden" name="ofertaId" value={oferta.id} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={labelStyle}>NÚMERO DE CERTIFICADO</label>
                <input name="numeroCertificado" required style={inputStyle} defaultValue={oferta.certificacion?.numeroCertificado ?? ''} placeholder="ISCC-EU-XXXXXX" />
              </div>
              <div>
                <label style={labelStyle}>VENCIMIENTO</label>
                <input
                  name="fechaVencimiento"
                  type="date"
                  required
                  style={inputStyle}
                  defaultValue={oferta.certificacion?.fechaVencimiento.toISOString().slice(0, 10) ?? ''}
                />
              </div>
            </div>
            <button type="submit" style={{ background: '#1a3a28', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              Guardar certificación
            </button>
          </form>
        </div>

        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>DDS / EUDR</div>
          <div style={{ fontSize: 11, color: 'rgba(13,26,20,0.45)', marginBottom: 12 }}>
            Declaración de Diligencia Debida — deadline vinculante 30/12/2026.
          </div>
          <form action={guardarDds}>
            <input type="hidden" name="ofertaId" value={oferta.id} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={labelStyle}>PAÍS DE ORIGEN</label>
                <input name="paisOrigen" required style={inputStyle} defaultValue={oferta.ddsDocumento?.paisOrigen ?? 'Argentina'} />
              </div>
              <div>
                <label style={labelStyle}>FECHA DE PRODUCCIÓN</label>
                <input
                  name="fechaProduccion"
                  type="date"
                  required
                  style={inputStyle}
                  defaultValue={oferta.ddsDocumento?.fechaProduccion.toISOString().slice(0, 10) ?? ''}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={labelStyle}>LATITUD DE ORIGEN</label>
                <input name="lat" type="number" step="0.0001" required style={inputStyle} defaultValue={oferta.lat ?? ''} />
              </div>
              <div>
                <label style={labelStyle}>LONGITUD DE ORIGEN</label>
                <input name="lng" type="number" step="0.0001" required style={inputStyle} defaultValue={oferta.lng ?? ''} />
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>REFERENCIA TRACES — opcional (TODO: integración EU TRACES)</label>
              <input name="numeroReferencia" style={inputStyle} defaultValue={oferta.ddsDocumento?.numeroReferencia ?? ''} placeholder="Pendiente" />
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button type="submit" style={{ background: '#c8902a', color: '#0d1a14', border: 'none', borderRadius: 4, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                {oferta.ddsDocumento ? 'Actualizar DDS' : 'Generar DDS'}
              </button>
              {oferta.ddsDocumento && (
                <a href={`/api/dds/${oferta.id}/pdf`} target="_blank" style={{ fontSize: 12, color: '#1a4a7a', fontWeight: 600 }}>
                  Descargar PDF →
                </a>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
