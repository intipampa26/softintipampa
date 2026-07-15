-- ============================================================
-- SEED LOCAL — Intipampa ERP
-- Borra todos los datos de usuario y recrea desde cero
-- ============================================================

-- 1. LIMPIAR (orden respeta FKs)
TRUNCATE TABLE
  orden_exportacion, orden_post_venta, orden_preventa,
  orden_alistado, orden_cotizaciones, orden_pasos,
  ordenes_venta,
  evaluaciones_fisicas, evaluaciones_sensoriales,
  muestras,
  mermas, trillados, movimientos_cadex,
  lote_final_origenes, lotes_finales, lotes,
  parcelas_campana, evidencias_familiares, evidencias,
  familiares_productor, parcelas, productores, campanas
RESTART IDENTITY CASCADE;

-- ============================================================
-- 2. CAMPAÑAS
-- ============================================================
INSERT INTO campanas (id, nombre, descripcion, temporada, "fechaInicio", "fechaFin") VALUES
(1, 'Campaña 2025', 'Campaña café y cacao 2025 — Colectivo Bean', 'cafe', '2025-01-01', '2025-12-31');

-- ============================================================
-- 3. PRODUCTORES (10)
-- ============================================================
INSERT INTO productores (id, nombre, apellido, telefono, departamento, provincia, distrito, "tipoProducto", "esApto", activo, "campanaId") VALUES
(1,  'Roberto',  'Díaz Guevara',    '945 001 001', 'San Martín', 'Moyobamba',      'Moyobamba',       'cafe',  true, true, 1),
(2,  'María',    'Huanca Quispe',   '945 001 002', 'Amazonas',   'Bagua',          'Bagua Grande',    'cafe',  true, true, 1),
(3,  'Juan',     'Flores Paredes',  '945 001 003', 'Cajamarca',  'Jaén',           'Jaén',            'cafe',  true, true, 1),
(4,  'Ana',      'Torres Sánchez',  '945 001 004', 'San Martín', 'Lamas',          'Lamas',           'cacao', true, true, 1),
(5,  'Carlos',   'Mendoza Ruiz',    '945 001 005', 'Amazonas',   'Utcubamba',      'Bagua Grande',    'cafe',  true, true, 1),
(6,  'Elena',    'Vargas López',    '945 001 006', 'Cusco',      'La Convención',  'Santa Ana',       'cafe',  true, true, 1),
(7,  'Pedro',    'Condori Mamani',  '945 001 007', 'San Martín', 'Tocache',        'Tocache',         'cacao', true, true, 1),
(8,  'Lucía',    'Ríos Chávez',     '945 001 008', 'San Martín', 'Rioja',          'Nueva Cajamarca', 'cafe',  true, true, 1),
(9,  'Miguel',   'Aguirre Soto',    '945 001 009', 'Cajamarca',  'San Ignacio',    'San Ignacio',     'cafe',  true, true, 1),
(10, 'Rosa',     'Tuesta Pinchi',   '945 001 010', 'Amazonas',   'Bagua',          'Aramango',        'cafe',  true, true, 1);

-- ============================================================
-- 4. PARCELAS (1 por productor)
-- ============================================================
INSERT INTO parcelas (id, codigo, nombre, "tipoProducto", activo, "productorId", "areaTotalFinca", "hectareasCafe", altitud) VALUES
(1,  'PAR-001', 'Finca La Esperanza',    'cafe',  true, 1,  5.50, 4.00, 1650),
(2,  'PAR-002', 'Finca El Edén',         'cafe',  true, 2,  3.20, 2.80, 1820),
(3,  'PAR-003', 'Lote Los Cipreses',     'cafe',  true, 3,  6.00, 5.00, 1750),
(4,  'PAR-004', 'Finca Los Naranjos',    'cacao', true, 4,  4.50, 4.00,  850),
(5,  'PAR-005', 'Finca Amanecer',        'cafe',  true, 5,  2.80, 2.50, 1600),
(6,  'PAR-006', 'Alto Urubamba',         'cafe',  true, 6,  7.20, 6.00, 1900),
(7,  'PAR-007', 'Parcela Tocache',       'cacao', true, 7,  5.00, 4.80,  900),
(8,  'PAR-008', 'Finca Nueva Vida',      'cafe',  true, 8,  3.80, 3.20, 1550),
(9,  'PAR-009', 'Lote San Ignacio',      'cafe',  true, 9,  8.50, 7.00, 1800),
(10, 'PAR-010', 'Finca Aramango',        'cafe',  true, 10, 4.20, 3.50, 1700);

-- ============================================================
-- 5. LOTES (20 — 2 por productor, ene–jun 2025)
-- ============================================================
INSERT INTO lotes (id, codigo, "tipoProductoId", "campanaId", "productorId", "parcelaId", "cantidadKg", "cantidadSacos", estado, "fechaAdquisicion", variedad, planta, activo) VALUES
-- Roberto Díaz — Café — San Martín
(1,  'LOT-2025-001', 1, 1,  1,  1,  300.000,  6, 'POST_ADQUISICION', '2025-01-15', 'Gesha',       'Kuska',       true),
(2,  'LOT-2025-002', 1, 1,  1,  1,  250.000,  5, 'POST_ADQUISICION', '2025-02-20', 'Caturra',     'CB Jaen',     true),
-- María Huanca — Café — Amazonas
(3,  'LOT-2025-003', 1, 1,  2,  2,  420.000,  9, 'POST_ADQUISICION', '2025-01-22', 'Pacamara',    'Selva Norte', true),
(4,  'LOT-2025-004', 1, 1,  2,  2,  180.000,  4, 'POST_ADQUISICION', '2025-03-10', 'Bourbon Rojo','CB Lima',     true),
-- Juan Flores — Café — Cajamarca
(5,  'LOT-2025-005', 1, 1,  3,  3,  550.000, 11, 'POST_ADQUISICION', '2025-02-05', 'Typica',      'Norandino',   true),
(6,  'LOT-2025-006', 1, 1,  3,  3,  300.000,  6, 'POST_ADQUISICION', '2025-04-18', 'Gesha',       'Expocafé',    true),
-- Ana Torres — Cacao — San Martín
(7,  'LOT-2025-007', 2, 1,  4,  4,  400.000,  8, 'POST_ADQUISICION', '2025-03-08', 'CCN-51',      'Mego',        true),
(8,  'LOT-2025-008', 2, 1,  4,  4,  280.000,  6, 'POST_ADQUISICION', '2025-05-12', 'Trinitario',  'Selva Norte', true),
-- Carlos Mendoza — Café — Amazonas
(9,  'LOT-2025-009', 1, 1,  5,  5,  650.000, 13, 'POST_ADQUISICION', '2025-02-14', 'Pache',       'CB Jaen',     true),
(10, 'LOT-2025-010', 1, 1,  5,  5,  200.000,  4, 'POST_ADQUISICION', '2025-05-28', 'Catimor',     'Kuska',       true),
-- Elena Vargas — Café — Cusco
(11, 'LOT-2025-011', 1, 1,  6,  6,  380.000,  8, 'POST_ADQUISICION', '2025-01-30', 'Bourbon',     'CB Lima',     true),
(12, 'LOT-2025-012', 1, 1,  6,  6,  290.000,  6, 'POST_ADQUISICION', '2025-06-05', 'SL28',        'Selva Norte', true),
-- Pedro Condori — Cacao — San Martín
(13, 'LOT-2025-013', 2, 1,  7,  7,  520.000, 11, 'POST_ADQUISICION', '2025-04-02', 'Chuncho',     'Mego',        true),
(14, 'LOT-2025-014', 2, 1,  7,  7,  350.000,  7, 'POST_ADQUISICION', '2025-06-15', 'Blanco',      'CB Jaen',     true),
-- Lucía Ríos — Café — San Martín
(15, 'LOT-2025-015', 1, 1,  8,  8,  430.000,  9, 'POST_ADQUISICION', '2025-03-25', 'Caturra',     'Norandino',   true),
(16, 'LOT-2025-016', 1, 1,  8,  8,  260.000,  5, 'POST_ADQUISICION', '2025-05-08', 'Bourbon Rojo','CB Jaen',     true),
-- Miguel Aguirre — Café — Cajamarca
(17, 'LOT-2025-017', 1, 1,  9,  9,  700.000, 14, 'POST_ADQUISICION', '2025-02-18', 'Typica',      'Selva Norte', true),
(18, 'LOT-2025-018', 1, 1,  9,  9,  150.000,  3, 'POST_ADQUISICION', '2025-06-20', 'Gesha',       'Expocafé',    true),
-- Rosa Tuesta — Café — Amazonas
(19, 'LOT-2025-019', 1, 1, 10, 10,  480.000, 10, 'POST_ADQUISICION', '2025-03-12', 'Pacamara',    'CB Lima',     true),
(20, 'LOT-2025-020', 1, 1, 10, 10,  320.000,  7, 'POST_ADQUISICION', '2025-04-22', 'Catimor',     'Kuska',       true);

-- ============================================================
-- 6. LOTES FINALES (6)
-- ============================================================
-- SKU IDs relevantes: 11=Gesha, 13=Caturra, 10=Pacamara, 21=Café Premium, 29=Cacao Comunal, 20=Café Comercial
INSERT INTO lotes_finales (id, codigo, "tipoProductoId", "campanaId", "cantidadKg", "tipoOrigen", estado, "fechaCreacion", "skuId", activo) VALUES
(1, 'LF-2025-001', 1, 1,  450.000, 'DIRECTO', 'TRILLADO',  '2025-03-20', 11, true),  -- Gesha
(2, 'LF-2025-002', 1, 1,  680.000, 'MEZCLA',  'TRILLADO',  '2025-04-05', 13, true),  -- Caturra blend
(3, 'LF-2025-003', 1, 1,  320.000, 'DIRECTO', 'VENDIDO',   '2025-03-01', 10, true),  -- Pacamara
(4, 'LF-2025-004', 1, 1,  600.000, 'MEZCLA',  'VENDIDO',   '2025-04-15', 21, true),  -- Café Premium
(5, 'LF-2025-005', 2, 1,  480.000, 'MEZCLA',  'VENDIDO',   '2025-05-10', 29, true),  -- Cacao Comunal
(6, 'LF-2025-006', 1, 1,  750.000, 'MEZCLA',  'TRILLADO',  '2025-05-20', 20, true);  -- Café Comercial

-- ============================================================
-- 7. LOTE FINAL ORIGENES (qué lotes conforman cada LF)
-- ============================================================
INSERT INTO lote_final_origenes ("loteFinalId", "loteOrigenId", "cantidadAportadaKg") VALUES
(1, 1,  300.000),   -- LF-001 ← LOT-001 Roberto Gesha
(1, 6,  150.000),   -- LF-001 ← LOT-006 Juan Gesha (parcial)
(2, 2,  250.000),   -- LF-002 ← LOT-002 Roberto Caturra
(2, 15, 430.000),   -- LF-002 ← LOT-015 Lucía Caturra
(3, 3,  320.000),   -- LF-003 ← LOT-003 María Pacamara
(4, 5,  300.000),   -- LF-004 ← LOT-005 Juan Typica
(4, 9,  300.000),   -- LF-004 ← LOT-009 Carlos Pache
(5, 7,  200.000),   -- LF-005 ← LOT-007 Ana Cacao
(5, 8,  280.000),   -- LF-005 ← LOT-008 Ana Cacao
(6, 17, 450.000),   -- LF-006 ← LOT-017 Miguel Typica
(6, 19, 300.000);   -- LF-006 ← LOT-019 Rosa Pacamara

-- ============================================================
-- 8. ORDENES DE VENTA (10: 5 nacional + 5 internacional)
-- ============================================================
INSERT INTO ordenes_venta (id, codigo, cliente, productor, campana, lote, "cantidadKg", destino, "tipoProducto", "montoUSD", moneda, mercado, fecha, "etapaActual", activo) VALUES
-- NACIONAL (PEN)
(1,  'OV-2025-001', 'Tostadora Lima SAC',        'Roberto Díaz Guevara',   'Campaña 2025', 'LF-2025-001',  200.000, 'Lima',        'Café',   8000.00, 'PEN', 'NACIONAL',       '2025-03-15', 'post_venta',  true),
(2,  'OV-2025-002', 'Supermercados Wong',         'Lucía Ríos Chávez',      'Campaña 2025', 'LF-2025-002',  350.000, 'Lima',        'Café',  14700.00, 'PEN', 'NACIONAL',       '2025-04-10', 'post_venta',  true),
(3,  'OV-2025-003', 'Café Baguette',              'Juan Flores Paredes',    'Campaña 2025', 'LF-2025-003',  150.000, 'Lima',        'Café',   7500.00, 'PEN', 'NACIONAL',       '2025-05-20', 'post_venta',  true),
(4,  'OV-2025-004', 'Distribuidora Norte EIRL',   'Rosa Tuesta Pinchi',     'Campaña 2025', 'LF-2025-006',  400.000, 'Lima',       'Café',  15200.00, 'PEN', 'NACIONAL',       '2025-06-05', 'alistado',    true),
(5,  'OV-2025-005', 'Restaurante El Aleph',       'Carlos Mendoza Ruiz',    'Campaña 2025', 'LF-2025-004',  120.000, 'Lima',        'Café',   5040.00, 'PEN', 'NACIONAL',       '2025-06-18', 'preventa',    true),
-- INTERNACIONAL (USD)
(6,  'OV-2025-006', 'Green Coffee Co',            'María Huanca Quispe',    'Campaña 2025', 'LF-2025-003',  300.000, 'USA',         'Café',   4500.00, 'USD', 'INTERNACIONAL',  '2025-02-20', 'post_venta',  true),
(7,  'OV-2025-007', 'Specialty Roasters Inc',     'Roberto Díaz Guevara',   'Campaña 2025', 'LF-2025-001',  450.000, 'USA',         'Café',   7200.00, 'USD', 'INTERNACIONAL',  '2025-03-10', 'exportacion', true),
(8,  'OV-2025-008', 'Kaffehaus Berlin GmbH',      'Juan Flores Paredes',    'Campaña 2025', 'LF-2025-004',  500.000, 'Alemania',    'Café',   8750.00, 'USD', 'INTERNACIONAL',  '2025-04-25', 'exportacion', true),
(9,  'OV-2025-009', 'Tokyo Beans Ltd',            'Elena Vargas López',     'Campaña 2025', 'LF-2025-005',  280.000, 'Japón',       'Cacao',  5040.00, 'USD', 'INTERNACIONAL',  '2025-05-15', 'post_venta',  true),
(10, 'OV-2025-010', 'Nordic Coffee AB',           'Miguel Aguirre Soto',    'Campaña 2025', 'LF-2025-006',  320.000, 'Suecia',      'Café',   6720.00, 'USD', 'INTERNACIONAL',  '2025-06-01', 'exportacion', true);

-- ============================================================
-- 9. RESET SEQUENCES
-- ============================================================
SELECT setval('campanas_id_seq',          (SELECT MAX(id) FROM campanas));
SELECT setval('productores_id_seq',       (SELECT MAX(id) FROM productores));
SELECT setval('parcelas_id_seq',          (SELECT MAX(id) FROM parcelas));
SELECT setval('lotes_id_seq',             (SELECT MAX(id) FROM lotes));
SELECT setval('lotes_finales_id_seq',     (SELECT MAX(id) FROM lotes_finales));
SELECT setval('lote_final_origenes_id_seq',(SELECT MAX(id) FROM lote_final_origenes));
SELECT setval('ordenes_venta_id_seq',     (SELECT MAX(id) FROM ordenes_venta));
