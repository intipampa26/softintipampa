-- ─── Migración 005: Crear tabla parcelas ─────────────────────────────────────
-- TypeORM synchronize:true aplica estos cambios automáticamente al iniciar.
-- Este archivo es solo referencia documental.

-- 1. Crear el tipo enum para tipoProducto de parcelas
DO $$ BEGIN
  CREATE TYPE parcelas_tipoproducto_enum AS ENUM ('cafe', 'cacao', 'cafe_cacao');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 2. Crear tabla parcelas
CREATE TABLE IF NOT EXISTS parcelas (
  id            SERIAL PRIMARY KEY,
  codigo        VARCHAR(100) NOT NULL UNIQUE,
  nombre        VARCHAR(200) NOT NULL,
  descripcion   TEXT,
  "fechaRegistro" DATE,
  "tipoProducto"  parcelas_tipoproducto_enum,
  activo        BOOLEAN NOT NULL DEFAULT TRUE,
  "productorId"   INTEGER NOT NULL REFERENCES productores(id) ON DELETE CASCADE,
  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Índices
CREATE INDEX IF NOT EXISTS idx_parcelas_productor
  ON parcelas ("productorId");

CREATE UNIQUE INDEX IF NOT EXISTS idx_parcelas_codigo
  ON parcelas (codigo);
