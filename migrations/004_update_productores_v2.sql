-- ─── Migración 004: Actualización de tabla productores (v2) ─────────────────
-- TypeORM synchronize:true aplica estos cambios automáticamente al iniciar.
-- Este archivo es solo referencia documental.

-- 1. Hacer nullable la columna apellido (antes NOT NULL)
ALTER TABLE productores ALTER COLUMN apellido DROP NOT NULL;

-- 2. Agregar campo fecha (date nullable)
ALTER TABLE productores ADD COLUMN IF NOT EXISTS fecha DATE;

-- 3. Agregar campo descripcion (text nullable)
ALTER TABLE productores ADD COLUMN IF NOT EXISTS descripcion TEXT;

-- 4. Agregar campo fotoUrl (varchar nullable)
ALTER TABLE productores ADD COLUMN IF NOT EXISTS "fotoUrl" VARCHAR(500);

-- 5. Crear el tipo enum para tipoProducto
DO $$ BEGIN
  CREATE TYPE productores_tipoproducto_enum AS ENUM ('cafe', 'cacao', 'cafe_cacao');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 6. Agregar campo tipoProducto (enum nullable)
ALTER TABLE productores
  ADD COLUMN IF NOT EXISTS "tipoProducto" productores_tipoproducto_enum;

-- 7. Agregar campo esApto (boolean, default true)
ALTER TABLE productores
  ADD COLUMN IF NOT EXISTS "esApto" BOOLEAN NOT NULL DEFAULT TRUE;

-- Índice para filtrar por tipo de producto (opcional)
CREATE INDEX IF NOT EXISTS idx_productores_tipo_producto
  ON productores ("tipoProducto");
