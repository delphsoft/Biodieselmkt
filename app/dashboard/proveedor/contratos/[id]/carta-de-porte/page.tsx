import { notFound } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { requireRole } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { crearCartaDePorte } from '@/app/actions/cartaDePorte'

const inputStyle = { width: '100%', padding: '9px 11px', border: '1px solid rgba(13,26,20,0.15)', borderRadius: 4, fontSize: 12, boxSizing: 'border-box' as const }
const labelStyle = { display: 'block', fontSize: 9, letterSpacing: '0.06em', color: 'rgba(13,26,20,0.5)', marginBottom: 5 }

export default async function CartaDePortePage({ params }: { params: { id: string } }) {
  const { empresa } = await requireRole('PROVEEDOR')

  const contrato = await prisma.contratoFosfa.findFirst({
    where: { id: params.id, oferta: { empresaId: empresa!.id } },
    include: { oferta: true, comprador: true, cartaDePorte: true },
  })
  if (!contrato || contrato.status === 'BORRADOR') notFound()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#ede8dc' }}>
      <Sidebar role="PROVEEDOR" nombre={empresa!.razonSocial} provincia={empresa!.provincia} />
      <main style={{ flex: 1, padding: '24px 32px', maxWidth: 520 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Carta de porte</h1>
        <p style={{ fontSize: 12, color: 'rgba(13,26,20,0.5)', marginBottom: 4 }}>
          Contrato {contrato.numeroContrato} · {contrato.oferta.volumenTon.toLocaleString('es-AR')} t
        </p>
        <p style={{ fontSize: 11, color: '#c8902a', marginBottom: 20 }}>
          TODO: sin integración con el webservice de ARCA todavía — este documento se genera como PDF con los datos cargados acá.
        </p>

        <form action={crearCartaDePorte} style={{ background: '#fff', border: '1px solid rgba(13,26,20,0.1)', borderRadius: 8, padding: 20 }}>
          <input type="hidden" name="contratoFosfaId" value={contrato.id} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>CUIT ORIGEN</label>
              <input name="cuitOrigen" required style={inputStyle} defaultValue={contrato.cartaDePorte?.cuitOrigen ?? ''} placeholder="30-12345678-9" />
            </div>
            <div>
              <label style={labelStyle}>CUIT DESTINO</label>
              <input name="cuitDestino" required style={inputStyle} defaultValue={contrato.cartaDePorte?.cuitDestino ?? ''} placeholder="30-98765432-1" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>TIPO DE CARGA</label>
              <input name="tipoCarga" required style={inputStyle} defaultValue={contrato.cartaDePorte?.tipoCarga ?? 'Biodiesel B100 a granel'} />
            </div>
            <div>
              <label style={labelStyle}>PESO (KG)</label>
              <input name="pesoKg" type="number" step="0.01" required style={inputStyle} defaultValue={contrato.cartaDePorte?.pesoKg ?? Math.round(contrato.oferta.volumenTon * 1000)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>CUIT TRANSPORTISTA</label>
              <input name="transportistaCuit" required style={inputStyle} defaultValue={contrato.cartaDePorte?.transportistaCuit ?? ''} placeholder="20-11223344-5" />
            </div>
            <div>
              <label style={labelStyle}>NOMBRE TRANSPORTISTA</label>
              <input name="transportistaNombre" required style={inputStyle} defaultValue={contrato.cartaDePorte?.transportistaNombre ?? ''} placeholder="Transportes del Litoral SRL" />
            </div>
          </div>
          <button type="submit" style={{ width: '100%', padding: 12, background: '#c8902a', border: 'none', borderRadius: 4, fontSize: 13, color: '#0d1a14', fontWeight: 700, cursor: 'pointer' }}>
            {contrato.cartaDePorte ? 'Actualizar y regenerar PDF' : 'Generar carta de porte'}
          </button>
        </form>
      </main>
    </div>
  )
}
