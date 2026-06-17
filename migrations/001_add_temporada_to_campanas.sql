-- ============================================================
--  Migración 001 — Agregar columna "temporada" a campanas
--  Fecha   : 2026-03-24
--  Proyecto: Intipampa
-- ============================================================
--
--  Cómo ejecutar en producción (Docker):
--
--    docker exec -i intipampa_db psql \
--      -U intipampa_user -d intipampa \
--      < migrations/001_add_temporada_to_campanas.sql
--
--  O copiando el archivo al contenedor:
--
--    docker cp migrations/001_add_temporada_to_campanas.sql intipampa_db:/tmp/
--    docker exec intipampa_db psql \
--      -U intipampa_user -d intipampa \
--      -f /tmp/001_add_temporada_to_campanas.sql
-- ============================================================

BEGIN;

-- 1. Crear el tipo enum si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'campanas_temporada_enum'
  ) THEN
    CREATE TYPE campanas_temporada_enum AS ENUM (
      'cafe',
      'cacao',
      'cafe_cacao'
    );
  END IF;
END
$$;

-- 2. Agregar la columna "temporada" si no existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM   information_schema.columns
    WHERE  table_name  = 'campanas'
      AND  column_name = 'temporada'
  ) THEN
    ALTER TABLE campanas
      ADD COLUMN temporada campanas_temporada_enum NOT NULL DEFAULT 'cafe';
  END IF;
END
$$;

-- 3. (Opcional) Actualizar filas existentes según tu criterio.
--    Por defecto todas quedan con 'cafe'.
--    Si quieres cambiar algunas descomenta y ajusta:
--
-- UPDATE campanas SET temporada = 'cacao'     WHERE nombre ILIKE '%cacao%';
-- UPDATE campanas SET temporada = 'cafe_cacao' WHERE nombre ILIKE '%café/cacao%'
--                                               OR nombre ILIKE '%cafe/cacao%';

COMMIT;

-- Verificación
SELECT
  id,
  nombre,
  anio,
  estado,
  temporada
FROM campanas
ORDER BY id;
