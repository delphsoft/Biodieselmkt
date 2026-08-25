// Checklist mínimo de términos FOSFA estándar (basado en FOSFA 54) que
// captura una operación de exportación real. No es un motor legal completo:
// es la lista editable que se guarda en ContratoFosfa.clausulas (Json).
export const CLAUSULAS_FOSFA_DEFAULT = [
  { id: 'calidad', label: 'Calidad según especificación FAME acordada', checked: true },
  { id: 'iscc', label: 'Certificación ISCC EU vigente al embarque', checked: true },
  { id: 'eudr', label: 'DDS / trazabilidad EUDR verificada', checked: true },
  { id: 'inspeccion', label: 'Inspección independiente en puerto de embarque', checked: true },
  { id: 'pago', label: 'Pago contra documentos de embarque (FOSFA 54 cl. 14)', checked: true },
  { id: 'arbitraje', label: 'Arbitraje FOSFA en caso de disputa', checked: true },
] as const

export type Clausula = { id: string; label: string; checked: boolean }

export const INCOTERMS = ['FOB', 'CIF', 'CFR', 'EXW', 'FCA'] as const
