-- ============================================================
-- Migración 003: Crear tabla productores
-- Fecha: 2026-03-29
-- Descripción: Tabla para productores asociados a campañas.
--   - Soft delete via columna 'activo'
--   - FK a campanas (RESTRICT para proteger integridad)
--   - Índices en campanaId y activo para filtros frecuentes
-- ============================================================

CREATE TABLE IF NOT EXISTS productores (
  id             SERIAL PRIMARY KEY,
  nombre         VARCHAR(200)  NOT NULL,
  apellido       VARCHAR(200)  NOT NULL,
  "nroDocumento" VARCHAR(50),
  telefono       VARCHAR(20),
  email          VARCHAR(200),
  direccion      TEXT,
  activo         BOOLEAN       NOT NULL DEFAULT TRUE,
  "campanaId"    INTEGER       NOT NULL REFERENCES campanas(id) ON DELETE RESTRICT,
  "createdAt"    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  "updatedAt"    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Índice para filtrar por campaña (filtro más frecuente)
CREATE INDEX IF NOT EXISTS idx_productores_campana
  ON productores("campanaId");

-- Índice para filtrar activos
CREATE INDEX IF NOT EXISTS idx_productores_activo
  ON productores(activo);

-- Índice compuesto para el caso de uso más común: productores activos por campaña
CREATE INDEX IF NOT EXISTS idx_productores_campana_activo
  ON productores("campanaId", activo);

-- NOTA: TypeORM synchronize:true crea esta tabla automáticamente al levantar el backend.
--       Este archivo es referencia para ambientes donde se use synchronize:false.
