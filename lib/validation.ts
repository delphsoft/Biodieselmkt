import { z } from 'zod'

export const TIPOS_EMPRESA = ['PLANTA', 'PETROLERA', 'EXPORTADORA', 'DISTRIBUIDOR'] as const

export const empresaSchema = z.object({
  cuit: z
    .string()
    .trim()
    .regex(/^\d{2}-?\d{8}-?\d{1}$/, 'CUIT inválido. Formato: 30-12345678-9'),
  razonSocial: z.string().trim().min(2, 'Razón social requerida'),
  tipo: z.enum(TIPOS_EMPRESA),
  provincia: z.string().trim().min(2, 'Provincia requerida'),
})

export type EmpresaFormInput = z.infer<typeof empresaSchema>
