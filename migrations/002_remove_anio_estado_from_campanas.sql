-- ============================================================
--  Migración 002 — Eliminar columnas "anio" y "estado" de campanas
--  Fecha   : 2026-03-24
--  Proyecto: Intipampa
-- ============================================================
--
--  Cómo ejecutar en producción (Docker):
--
--    docker exec -i intipampa_db psql \
--      -U intipampa_user -d intipampa \
--      < migrations/002_remove_anio_estado_from_campanas.sql
-- ============================================================

BEGIN;

-- 1. Eliminar columna "anio" si existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campanas' AND column_name = 'anio'
  ) THEN
    ALTER TABLE campanas DROP COLUMN anio;
  END IF;
END
$$;

-- 2. Eliminar columna "estado" si existe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'campanas' AND column_name = 'estado'
  ) THEN
    ALTER TABLE campanas DROP COLUMN estado;
  END IF;
END
$$;

-- 3. Eliminar el tipo enum de estado si existe
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'campanas_estado_enum') THEN
    DROP TYPE campanas_estado_enum;
  END IF;
END
$$;

COMMIT;

-- Verificación
SELECT id, nombre, temporada, "fechaInicio", "fechaFin", "createdAt"
FROM campanas
ORDER BY id;
