-- ─── Migración 006: Crear tabla familiares_productor ──────────────────────────
-- Modified by Claude Code - Family Producer Module
-- TypeORM synchronize:true aplica estos cambios automáticamente al iniciar.
-- Este archivo es referencia documental del schema creado.

-- 1. Enums
DO $$ BEGIN
  CREATE TYPE familiares_productor_parentesco_enum AS ENUM (
    'conyugue','hijo','hija','padre','madre','hermano','hermana',
    'abuelo','abuela','nieto','nieta','tio','tia','sobrino','sobrina',
    'primo','prima','suegro','suegra','yerno','nuera','otro'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE familiares_productor_tipodocumento_enum AS ENUM (
    'dni','ce','pasaporte','partida_nacimiento','otro'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE familiares_productor_sexo_enum AS ENUM (
    'masculino','femenino','otro'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 2. Tabla principal
CREATE TABLE IF NOT EXISTS familiares_productor (
  id                SERIAL PRIMARY KEY,
  "productorId"     INTEGER NOT NULL REFERENCES productores(id) ON DELETE CASCADE,
  nombres           VARCHAR(200) NOT NULL,
  apellidos         VARCHAR(200) NOT NULL,
  parentesco        familiares_productor_parentesco_enum NOT NULL DEFAULT 'otro',
  sexo              familiares_productor_sexo_enum,
  "fechaNacimiento" DATE,
  "tipoDocumento"   familiares_productor_tipodocumento_enum,
  "nroDocumento"    VARCHAR(50),
  telefono          VARCHAR(20),
  correo            VARCHAR(200),
  direccion         TEXT,
  observaciones     TEXT,
  activo            BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt"       TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Índices
CREATE INDEX IF NOT EXISTS idx_familiares_productor_productor
  ON familiares_productor ("productorId");

-- Índice compuesto para evitar duplicados por documento dentro del mismo productor
CREATE UNIQUE INDEX IF NOT EXISTS idx_familiares_productor_doc_unique
  ON familiares_productor ("productorId", "nroDocumento")
  WHERE "nroDocumento" IS NOT NULL;
