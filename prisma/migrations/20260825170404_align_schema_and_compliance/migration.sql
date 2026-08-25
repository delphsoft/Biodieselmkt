-- CreateTable
CREATE TABLE "Empresa" (
    "id" TEXT NOT NULL,
    "cuit" TEXT NOT NULL,
    "razonSocial" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Oferta" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "volumenTon" DOUBLE PRECISION NOT NULL,
    "famePct" DOUBLE PRECISION NOT NULL,
    "precioARS" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'ACTIVA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipoMercado" TEXT NOT NULL DEFAULT 'INTERNO',
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "isccActivo" BOOLEAN NOT NULL DEFAULT false,
    "eudrVerificado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Oferta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrecioSpot" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'ARS',
    "fuente" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrecioSpot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DdsDocumento" (
    "id" TEXT NOT NULL,
    "ofertaId" TEXT NOT NULL,
    "geolocalizacion" JSONB NOT NULL,
    "fechaProduccion" TIMESTAMP(3) NOT NULL,
    "paisOrigen" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "numeroReferencia" TEXT,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DdsDocumento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContratoFosfa" (
    "id" TEXT NOT NULL,
    "ofertaId" TEXT NOT NULL,
    "numeroContrato" TEXT NOT NULL,
    "compradorId" TEXT NOT NULL,
    "incoterm" TEXT NOT NULL,
    "volumenTon" DOUBLE PRECISION NOT NULL,
    "precioAcordadoUSD" DOUBLE PRECISION NOT NULL,
    "fechaEmbarque" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'BORRADOR',
    "clausulas" JSONB,
    "confirmadoProveedor" BOOLEAN NOT NULL DEFAULT false,
    "confirmadoComprador" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContratoFosfa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartaDePorte" (
    "id" TEXT NOT NULL,
    "ofertaId" TEXT,
    "contratoFosfaId" TEXT,
    "cuitOrigen" TEXT NOT NULL,
    "cuitDestino" TEXT NOT NULL,
    "tipoCarga" TEXT NOT NULL,
    "pesoKg" DOUBLE PRECISION NOT NULL,
    "transportistaCuit" TEXT NOT NULL,
    "transportistaNombre" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'BORRADOR',
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CartaDePorte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificacionISCC" (
    "id" TEXT NOT NULL,
    "ofertaId" TEXT NOT NULL,
    "numeroCertificado" TEXT NOT NULL,
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "CertificacionISCC_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cuit_key" ON "Empresa"("cuit");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_userId_key" ON "Empresa"("userId");

-- CreateIndex
CREATE INDEX "Oferta_status_idx" ON "Oferta"("status");

-- CreateIndex
CREATE INDEX "Oferta_empresaId_idx" ON "Oferta"("empresaId");

-- CreateIndex
CREATE INDEX "PrecioSpot_tipo_fecha_idx" ON "PrecioSpot"("tipo", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "DdsDocumento_ofertaId_key" ON "DdsDocumento"("ofertaId");

-- CreateIndex
CREATE UNIQUE INDEX "ContratoFosfa_ofertaId_key" ON "ContratoFosfa"("ofertaId");

-- CreateIndex
CREATE UNIQUE INDEX "ContratoFosfa_numeroContrato_key" ON "ContratoFosfa"("numeroContrato");

-- CreateIndex
CREATE UNIQUE INDEX "CartaDePorte_contratoFosfaId_key" ON "CartaDePorte"("contratoFosfaId");

-- CreateIndex
CREATE UNIQUE INDEX "CertificacionISCC_ofertaId_key" ON "CertificacionISCC"("ofertaId");

-- AddForeignKey
ALTER TABLE "Oferta" ADD CONSTRAINT "Oferta_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DdsDocumento" ADD CONSTRAINT "DdsDocumento_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "Oferta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContratoFosfa" ADD CONSTRAINT "ContratoFosfa_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "Oferta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContratoFosfa" ADD CONSTRAINT "ContratoFosfa_compradorId_fkey" FOREIGN KEY ("compradorId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartaDePorte" ADD CONSTRAINT "CartaDePorte_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "Oferta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartaDePorte" ADD CONSTRAINT "CartaDePorte_contratoFosfaId_fkey" FOREIGN KEY ("contratoFosfaId") REFERENCES "ContratoFosfa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificacionISCC" ADD CONSTRAINT "CertificacionISCC_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "Oferta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
