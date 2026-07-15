-- ============================================================
-- SEED — Muestras, Trillados y Mermas
-- ============================================================

-- Limpiar estas tablas primero
TRUNCATE TABLE evaluaciones_fisicas, evaluaciones_sensoriales,
               muestras, mermas, trillados
RESTART IDENTITY CASCADE;

-- ============================================================
-- 1. MUESTRAS (1 por cada lote)
-- ============================================================
-- tipoMuestra: 'cafe' | 'cacao'
-- estado: pendiente | en_proceso | completada | rechazada
-- Lotes café: 1-6, 9-12, 15-20  |  Lotes cacao: 7, 8, 13, 14

INSERT INTO muestras (
  id, codigo, "loteId", "campanaId", "productorId", "parcelaId",
  "cantidadKg", "fechaRegistro", "tipoMuestra",
  rendimiento, humedad, base, variedad, proceso,
  "puntajeFisico", "puntajeSensorial", "categoriaMuestra",
  estado, "añoCosecha", pais, region, activo
) VALUES
-- LOT-001  Roberto Díaz — Gesha
(1,  'MUE-2025-001', 1,  1, 1,  1,  0.350, '2025-01-20', 'cafe', 83.50, 11.20, '83', 'Gesha',       'Lavado',         88.50, 89.25, 'Especial',    'completada', 2025, 'Perú', 'San Martín',    true),
-- LOT-002  Roberto Díaz — Caturra
(2,  'MUE-2025-002', 2,  1, 1,  1,  0.350, '2025-02-25', 'cafe', 80.20, 11.80, '80', 'Caturra',     'Natural',        84.00, 84.50, 'Comercial',   'completada', 2025, 'Perú', 'San Martín',    true),
-- LOT-003  María Huanca — Pacamara
(3,  'MUE-2025-003', 3,  1, 2,  2,  0.350, '2025-01-28', 'cafe', 82.75, 11.50, '82', 'Pacamara',    'Honey',          87.25, 88.00, 'Especial',    'completada', 2025, 'Perú', 'Amazonas',      true),
-- LOT-004  María Huanca — Bourbon Rojo
(4,  'MUE-2025-004', 4,  1, 2,  2,  0.350, '2025-03-15', 'cafe', 79.50, 12.10, '79', 'Bourbon Rojo','Lavado',         83.50, 83.00, 'Comercial',   'completada', 2025, 'Perú', 'Amazonas',      true),
-- LOT-005  Juan Flores — Typica
(5,  'MUE-2025-005', 5,  1, 3,  3,  0.350, '2025-02-10', 'cafe', 81.40, 11.60, '81', 'Typica',      'Lavado',         86.00, 86.50, 'Especial',    'completada', 2025, 'Perú', 'Cajamarca',     true),
-- LOT-006  Juan Flores — Gesha
(6,  'MUE-2025-006', 6,  1, 3,  3,  0.350, '2025-04-22', 'cafe', 84.20, 11.00, '84', 'Gesha',       'Lavado',         90.00, 90.75, 'Especialísimo','completada', 2025, 'Perú', 'Cajamarca',    true),
-- LOT-007  Ana Torres — CCN-51
(7,  'MUE-2025-007', 7,  1, 4,  4,  0.350, '2025-03-12', 'cacao', 88.00, 7.50, NULL, 'CCN-51',      'Fermentado',     86.50, 87.00, 'Comercial',   'completada', 2025, 'Perú', 'San Martín',    true),
-- LOT-008  Ana Torres — Trinitario
(8,  'MUE-2025-008', 8,  1, 4,  4,  0.350, '2025-05-16', 'cacao', 87.20, 7.80, NULL, 'Trinitario',  'Fermentado',     85.50, 86.00, 'Fino',        'completada', 2025, 'Perú', 'San Martín',    true),
-- LOT-009  Carlos Mendoza — Pache
(9,  'MUE-2025-009', 9,  1, 5,  5,  0.350, '2025-02-18', 'cafe', 80.80, 11.90, '80', 'Pache',       'Natural',        85.00, 85.50, 'Especial',    'completada', 2025, 'Perú', 'Amazonas',      true),
-- LOT-010  Carlos Mendoza — Catimor
(10, 'MUE-2025-010', 10, 1, 5,  5,  0.350, '2025-06-01', 'cafe', 78.50, 12.50, '78', 'Catimor',     'Lavado',         80.00, 80.50, 'Comercial',   'pendiente',  2025, 'Perú', 'Amazonas',      true),
-- LOT-011  Elena Vargas — Bourbon
(11, 'MUE-2025-011', 11, 1, 6,  6,  0.350, '2025-02-03', 'cafe', 82.00, 11.30, '82', 'Bourbon',     'Lavado',         86.75, 87.25, 'Especial',    'completada', 2025, 'Perú', 'Cusco',         true),
-- LOT-012  Elena Vargas — SL28
(12, 'MUE-2025-012', 12, 1, 6,  6,  0.350, '2025-06-08', 'cafe', 83.10, 11.10, '83', 'SL28',        'Honey',          88.00, 88.50, 'Especial',    'en_proceso', 2025, 'Perú', 'Cusco',         true),
-- LOT-013  Pedro Condori — Chuncho
(13, 'MUE-2025-013', 13, 1, 7,  7,  0.350, '2025-04-06', 'cacao', 89.00, 7.20, NULL, 'Chuncho',     'Fermentado',     87.50, 88.25, 'Fino',        'completada', 2025, 'Perú', 'San Martín',    true),
-- LOT-014  Pedro Condori — Blanco
(14, 'MUE-2025-014', 14, 1, 7,  7,  0.350, '2025-06-18', 'cacao', 88.50, 7.40, NULL, 'Blanco',      'Fermentado',     86.00, 86.75, 'Fino',        'pendiente',  2025, 'Perú', 'San Martín',    true),
-- LOT-015  Lucía Ríos — Caturra
(15, 'MUE-2025-015', 15, 1, 8,  8,  0.350, '2025-03-28', 'cafe', 80.50, 11.70, '80', 'Caturra',     'Natural',        84.50, 85.00, 'Comercial',   'completada', 2025, 'Perú', 'San Martín',    true),
-- LOT-016  Lucía Ríos — Bourbon Rojo
(16, 'MUE-2025-016', 16, 1, 8,  8,  0.350, '2025-05-12', 'cafe', 81.80, 11.40, '81', 'Bourbon Rojo','Lavado',         85.75, 86.00, 'Especial',    'completada', 2025, 'Perú', 'San Martín',    true),
-- LOT-017  Miguel Aguirre — Typica
(17, 'MUE-2025-017', 17, 1, 9,  9,  0.350, '2025-02-22', 'cafe', 81.00, 11.50, '81', 'Typica',      'Lavado',         85.50, 86.00, 'Especial',    'completada', 2025, 'Perú', 'Cajamarca',     true),
-- LOT-018  Miguel Aguirre — Gesha
(18, 'MUE-2025-018', 18, 1, 9,  9,  0.350, '2025-06-22', 'cafe', 85.00, 10.80, '85', 'Gesha',       'Lavado',         91.00, 91.50, 'Especialísimo','pendiente',  2025, 'Perú', 'Cajamarca',    true),
-- LOT-019  Rosa Tuesta — Pacamara
(19, 'MUE-2025-019', 19, 1, 10, 10, 0.350, '2025-03-16', 'cafe', 82.30, 11.25, '82', 'Pacamara',    'Honey',          87.00, 87.75, 'Especial',    'completada', 2025, 'Perú', 'Amazonas',      true),
-- LOT-020  Rosa Tuesta — Catimor
(20, 'MUE-2025-020', 20, 1, 10, 10, 0.350, '2025-04-25', 'cafe', 79.00, 12.20, '79', 'Catimor',     'Lavado',         81.50, 81.00, 'Comercial',   'completada', 2025, 'Perú', 'Amazonas',      true);

-- ============================================================
-- 2. TRILLADOS (1 por cada lote final)
-- Todos los LF pasan por trilla antes de venderse/exportarse
-- Fórmula: pesoPfKg ≈ 70% café, 90% cacao
--          mermaReutilizableKg ≈ 20% café, 5% cacao  (cascarilla/pergamino → abono)
--          mermaDesechableKg   ≈ 10% café, 5% cacao  (tierra, impurezas)
-- ============================================================
INSERT INTO trillados (
  id, "loteFinalId", fecha, planta, malla, "tipoSeleccion", encargado,
  "pesoPfKg", "pesoPorQuintalKg", "cantidadQuintales", "kgSueltos",
  "mermaReutilizableKg", "mermaDesechableKg", "sobranteExportableKg",
  observaciones
) VALUES
-- LF-001 (450 kg Gesha) → 70% rendimiento
(1, 1, '2025-04-01', 'Kuska',       '16/64', 'Densimétrica',        'Jorge Ramírez',  315.000, 46.000, 6, 39.000, 90.000,  45.000,  315.000, 'Lote Gesha de alta calidad, perfil floral excelente'),
-- LF-002 (680 kg Caturra mezcla) → 70%
(2, 2, '2025-04-10', 'CB Jaen',     '15/64', 'Color',               'Sandra Llanos',  476.000, 46.000, 10, 16.000, 136.000, 68.000,  476.000, 'Mezcla Roberto + Lucía, lote comercial uniforme'),
-- LF-003 (320 kg Pacamara) → 70%
(3, 3, '2025-03-10', 'Selva Norte', '16/64', 'Mesa densimétrica',   'Jorge Ramírez',  224.000, 46.000, 4,  40.000, 64.000,  32.000,  224.000, 'Pacamara lavado, alta densidad'),
-- LF-004 (600 kg Café Premium mezcla) → 70%
(4, 4, '2025-04-20', 'Norandino',   '15/64', 'Densimétrica',        'Carlos Gutiérrez',420.000, 46.000, 9,  6.000, 120.000, 60.000,  420.000, 'Premium blend Typica + Pache, apto exportación'),
-- LF-005 (480 kg Cacao Comunal) → 90%
(5, 5, '2025-05-15', 'Mego',        NULL,    'Limpieza húmeda',     'Sandra Llanos',  432.000, 46.000, 9,  18.000, 24.000,  24.000,  432.000, 'Cacao beneficiado, fermentación 5 días, secado solar'),
-- LF-006 (750 kg Café Comercial mezcla) → 70%
(6, 6, '2025-05-25', 'Selva Norte', '14/64', 'Color',               'Carlos Gutiérrez',525.000, 46.000, 11, 19.000, 150.000, 75.000,  525.000, 'Lote comercial blend, buen cuerpo y acidez media');

-- ============================================================
-- 3. MERMAS (2 por trillado: REUTILIZABLE + DESECHABLE)
-- La REUTILIZABLE es cascarilla/pergamino → abono/biomasa
-- La DESECHABLE son impurezas/quebrados sin valor
-- ============================================================
INSERT INTO mermas (
  id, codigo, "loteFinalId", "trilladoId", "tipoMerma", "cantidadKg", "cantidadSacos", fecha, observaciones, activo
) VALUES
-- LF-001 Gesha
(1,  'MRM-2025-001', 1, 1, 'REUTILIZABLE',  90.000, 2, '2025-04-01', 'Cascarilla pergamino — destinada a compostaje', true),
(2,  'MRM-2025-002', 1, 1, 'DESECHABLE',    45.000, 1, '2025-04-01', 'Granos quebrados, impurezas y tierra',         true),
-- LF-002 Caturra blend
(3,  'MRM-2025-003', 2, 2, 'REUTILIZABLE', 136.000, 3, '2025-04-10', 'Cascarilla — entrega a productor para abono',  true),
(4,  'MRM-2025-004', 2, 2, 'DESECHABLE',    68.000, 2, '2025-04-10', 'Descarte por color y densidad',                true),
-- LF-003 Pacamara
(5,  'MRM-2025-005', 3, 3, 'REUTILIZABLE',  64.000, 2, '2025-03-10', 'Pergamino reutilizable para abono orgánico',   true),
(6,  'MRM-2025-006', 3, 3, 'DESECHABLE',    32.000, 1, '2025-03-10', 'Impurezas y granos inmaduros',                 true),
-- LF-004 Café Premium
(7,  'MRM-2025-007', 4, 4, 'REUTILIZABLE', 120.000, 3, '2025-04-20', 'Cascarilla — biomasa para energía',            true),
(8,  'MRM-2025-008', 4, 4, 'DESECHABLE',    60.000, 2, '2025-04-20', 'Granos negros y brocados descartados',         true),
-- LF-005 Cacao Comunal
(9,  'MRM-2025-009', 5, 5, 'REUTILIZABLE',  24.000, 1, '2025-05-15', 'Cascarilla de cacao — para té de cacao',      true),
(10, 'MRM-2025-010', 5, 5, 'DESECHABLE',    24.000, 1, '2025-05-15', 'Granos planos, impurezas y cuerpos extraños',  true),
-- LF-006 Café Comercial
(11, 'MRM-2025-011', 6, 6, 'REUTILIZABLE', 150.000, 4, '2025-05-25', 'Cascarilla — compostaje en finca productores', true),
(12, 'MRM-2025-012', 6, 6, 'DESECHABLE',    75.000, 2, '2025-05-25', 'Descarte final: tierra, granos dañados',       true);

-- ============================================================
-- 4. RESET SEQUENCES
-- ============================================================
SELECT setval('muestras_id_seq',  (SELECT MAX(id) FROM muestras));
SELECT setval('trillados_id_seq', (SELECT MAX(id) FROM trillados));
SELECT setval('mermas_id_seq',    (SELECT MAX(id) FROM mermas));
