-- ─── Migración 007: Seed familiares del productor Daniel Toledo ────────────────
-- Idempotente: puede ejecutarse varias veces sin error.
-- Si el productor no existe en la BD, el bloque finaliza sin insertar.

DO $$
DECLARE
  v_productor_id INTEGER;
BEGIN
  -- Buscar el productor Daniel Toledo (toma el primero si hay duplicados por campaña)
  SELECT id INTO v_productor_id
  FROM productores
  WHERE nombre = 'Daniel' AND apellido = 'Toledo'
  ORDER BY id
  LIMIT 1;

  IF v_productor_id IS NULL THEN
    RAISE NOTICE 'Productor Daniel Toledo no encontrado — seed omitido.';
    RETURN;
  END IF;

  -- Cónyuge
  INSERT INTO familiares_productor (
    "productorId", nombres, apellidos, parentesco, sexo,
    "tipoDocumento", "nroDocumento", "fechaNacimiento", activo, "createdAt", "updatedAt"
  ) VALUES (
    v_productor_id, 'María Elena', 'Quispe Toledo',
    'conyugue', 'femenino', 'dni', '47123456', '1985-03-22', TRUE, now(), now()
  ) ON CONFLICT ("productorId", "nroDocumento") WHERE "nroDocumento" IS NOT NULL DO NOTHING;

  -- Hijo mayor
  INSERT INTO familiares_productor (
    "productorId", nombres, apellidos, parentesco, sexo,
    "tipoDocumento", "nroDocumento", "fechaNacimiento", activo, "createdAt", "updatedAt"
  ) VALUES (
    v_productor_id, 'Luis Daniel', 'Toledo Quispe',
    'hijo', 'masculino', 'dni', '76543210', '2008-07-14', TRUE, now(), now()
  ) ON CONFLICT ("productorId", "nroDocumento") WHERE "nroDocumento" IS NOT NULL DO NOTHING;

  -- Hija menor
  INSERT INTO familiares_productor (
    "productorId", nombres, apellidos, parentesco, sexo,
    "tipoDocumento", "nroDocumento", "fechaNacimiento", activo, "createdAt", "updatedAt"
  ) VALUES (
    v_productor_id, 'Sofía Alejandra', 'Toledo Quispe',
    'hija', 'femenino', 'partida_nacimiento', '89012345', '2015-11-05', TRUE, now(), now()
  ) ON CONFLICT ("productorId", "nroDocumento") WHERE "nroDocumento" IS NOT NULL DO NOTHING;

  -- Padre
  INSERT INTO familiares_productor (
    "productorId", nombres, apellidos, parentesco, sexo,
    "tipoDocumento", "nroDocumento", "fechaNacimiento", activo, "createdAt", "updatedAt"
  ) VALUES (
    v_productor_id, 'Víctor Raúl', 'Toledo Mamani',
    'padre', 'masculino', 'dni', '10234567', '1958-09-30', TRUE, now(), now()
  ) ON CONFLICT ("productorId", "nroDocumento") WHERE "nroDocumento" IS NOT NULL DO NOTHING;

  RAISE NOTICE '✅ Familiares de Daniel Toledo (id=%) insertados correctamente.', v_productor_id;
END $$;
