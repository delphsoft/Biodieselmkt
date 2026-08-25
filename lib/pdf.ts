import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const ORO = rgb(0.784, 0.565, 0.165) // #c8902a
const VERDE_OSCURO = rgb(0.051, 0.102, 0.078) // #0d1a14
const GRIS = rgb(0.4, 0.4, 0.4)

interface DocLine {
  label: string
  value: string
}

async function baseDoc(titulo: string, subtitulo: string, lineas: DocLine[]) {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595.28, 841.89]) // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold)

  let y = 780

  page.drawRectangle({ x: 0, y: 800, width: 595.28, height: 41.89, color: VERDE_OSCURO })
  page.drawText('BiodieselOS', { x: 40, y: 815, size: 16, font: fontBold, color: ORO })

  y = 760
  page.drawText(titulo, { x: 40, y, size: 18, font: fontBold, color: VERDE_OSCURO })
  y -= 20
  page.drawText(subtitulo, { x: 40, y, size: 10, font, color: GRIS })
  y -= 30

  for (const linea of lineas) {
    page.drawText(linea.label.toUpperCase(), { x: 40, y, size: 8, font, color: GRIS })
    y -= 14
    page.drawText(String(linea.value), { x: 40, y, size: 12, font: fontBold, color: VERDE_OSCURO })
    y -= 22
  }

  page.drawText(`Generado por BiodieselOS · ${new Date().toISOString()}`, {
    x: 40, y: 40, size: 8, font, color: GRIS,
  })

  return pdf
}

export interface DdsPdfData {
  ofertaId: string
  volumenTon: number
  paisOrigen: string
  fechaProduccion: Date
  numeroReferencia?: string | null
  geolocalizacion: unknown
}

export async function generateDdsPdf(data: DdsPdfData): Promise<Uint8Array> {
  const pdf = await baseDoc(
    'Declaración de Diligencia Debida (DDS)',
    `Regulation (EU) 2023/1115 — deadline vinculante 30/12/2026 · Lote ${data.ofertaId}`,
    [
      { label: 'Volumen del lote', value: `${data.volumenTon} t` },
      { label: 'País de origen', value: data.paisOrigen },
      { label: 'Fecha de producción', value: data.fechaProduccion.toLocaleDateString('es-AR') },
      { label: 'Referencia TRACES', value: data.numeroReferencia || 'Pendiente de integración con EU TRACES (TODO)' },
      { label: 'Geolocalización', value: JSON.stringify(data.geolocalizacion).slice(0, 90) },
    ]
  )
  return pdf.save()
}

export interface CartaDePortePdfData {
  id: string
  cuitOrigen: string
  cuitDestino: string
  tipoCarga: string
  pesoKg: number
  transportistaCuit: string
  transportistaNombre: string
}

export async function generateCartaDePortePdf(data: CartaDePortePdfData): Promise<Uint8Array> {
  const pdf = await baseDoc(
    'Carta de Porte',
    `Documento interno — pendiente de emisión oficial vía webservice ARCA (TODO) · #${data.id}`,
    [
      { label: 'CUIT origen', value: data.cuitOrigen },
      { label: 'CUIT destino', value: data.cuitDestino },
      { label: 'Tipo de carga', value: data.tipoCarga },
      { label: 'Peso', value: `${data.pesoKg} kg` },
      { label: 'Transportista', value: `${data.transportistaNombre} (CUIT ${data.transportistaCuit})` },
    ]
  )
  return pdf.save()
}
