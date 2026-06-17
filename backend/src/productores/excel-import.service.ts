import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as XLSX from 'xlsx';
import { Productor } from './productor.entity';
import { Parcela } from '../parcelas/parcela.entity';
import { FamiliarProductor, Parentesco } from '../familiares-productor/familiar-productor.entity';

export interface ImportReport {
  productoresCreados: number;
  productoresActualizados: number;
  parcelasCreadas: number;
  parcelasActualizadas: number;
  filasFusionadasFamiliar: number;
  filasVaciasOmitidas: number;
  filasObservadas: number;
  logs: string[];
}

interface RawRow {
  [key: string]: unknown;
}

interface ProducerGroup {
  productorKey: string;
  rows: RawRow[];
}

function normalizeStr(val: unknown): string | null {
  if (val === null || val === undefined) return null;
  const s = String(val).trim().replace(/\s+/g, ' ').toUpperCase();
  if (s === '' || s === 'NAN' || s === 'NONE' || s === 'NULL') return null;
  return s;
}

function normalizeDni(val: unknown): string | null {
  if (val === null || val === undefined) return null;
  const raw = String(val).trim();
  if (raw === '' || raw.toUpperCase() === 'NAN') return null;
  
  const num = parseFloat(raw);
  if (!isNaN(num) && Number.isFinite(num)) return String(Math.round(num));
  return raw.replace(/\.0+$/, '');
}

function normalizePhone(val: unknown): string | null {
  if (val === null || val === undefined) return null;
  const raw = String(val).trim();
  if (!raw || raw.toUpperCase() === 'NAN') return null;
  
  const num = parseFloat(raw);
  if (!isNaN(num) && Number.isFinite(num)) return String(Math.round(num));
  return raw.replace(/\.0+$/, '');
}

function normalizeNum(val: unknown): number | null {
  if (val === null || val === undefined) return null;
  const n = parseFloat(String(val));
  return isNaN(n) ? null : n;
}

function normalizeBool(val: unknown): boolean | null {
  if (val === null || val === undefined) return null;
  const s = String(val).trim().toUpperCase();
  if (s === '' || s === 'NAN') return null;
  if (s === 'SI' || s === 'SÍ' || s === 'YES' || s === 'TRUE' || s === '1') return true;
  if (s === 'NO' || s === 'FALSE' || s === '0') return false;
  return null;
}

function cleanHeader(h: string): string {
  return h.trim().replace(/\s+/g, ' ');
}

function readSheet(buffer: Buffer): RawRow[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });

  const targetSheet = 'RESPUESTAS GENERAL';
  if (!workbook.SheetNames.includes(targetSheet)) {
    throw new BadRequestException(
      `El archivo no contiene la hoja "${targetSheet}". Hojas disponibles: ${workbook.SheetNames.join(', ')}`,
    );
  }

  const sheet = workbook.Sheets[targetSheet];
  const rows: RawRow[] = XLSX.utils.sheet_to_json(sheet, {
    defval: null,
    raw: true,
  });

  
  return rows.map((row) => {
    const cleaned: RawRow = {};
    for (const [k, v] of Object.entries(row)) {
      cleaned[cleanHeader(k)] = v;
    }
    return cleaned;
  });
}

function producerKey(row: RawRow): string | null {
  const dni = normalizeDni(row['4. DNI N°']);
  if (dni) return `DNI:${dni}`;

  const nombre = normalizeStr(row['1.Nombre y Apellidos']);
  if (nombre) return `NOMBRE:${nombre}`;

  return null;
}

function isRowEmpty(row: RawRow): boolean {
  return Object.values(row).every((v) => {
    if (v === null || v === undefined) return true;
    const s = String(v).trim();
    return s === '' || s.toUpperCase() === 'NAN';
  });
}

function rowToParcelaFields(row: RawRow): Partial<Parcela> {
  
  const secadoRaw = normalizeStr(row['19. ¿Tipo de secado?']);
  const secadoSolar = normalizeBool(row['Secador solar']);
  const tarima = normalizeBool(row['Tarima africana']);
  const manta = normalizeBool(row['Secado en manta']);

  const secadoParts: string[] = [];
  if (secadoRaw) secadoParts.push(secadoRaw);
  if (secadoSolar) secadoParts.push('Secador solar');
  if (tarima) secadoParts.push('Tarima africana');
  if (manta) secadoParts.push('Secado en manta');
  const tipoSecado = secadoParts.length > 0 ? secadoParts.join(', ') : null;

  const knowsSuelo = normalizeStr(row['20. ¿Conoces que tipo de suelo tiene tu finca? ¿Haces estudio de suelos?']);

  const nombreFinca = normalizeStr(row['1. Nombre de la Finca']);

  return {
    nombre: nombreFinca ?? 'Sin nombre',
    nombreFinca: nombreFinca,
    areaTotalFinca: normalizeNum(row['2. Área total de la Finca']),
    altitud: normalizeNum(row['3. Altitud']) as number | null,
    estadoPropiedad: normalizeStr(row['4. ¿Cuál es el estado de propiedad de su finca?']),
    inicioProduccionAnio: normalizeNum(row['5. Inicio de producción (año)']) as number | null,
    controlesBiologicos: normalizeBool(row['6. ¿Hacen uso de controles biológicos?']),
    usoHerbicidasChala: normalizeBool(row['7. ¿Hacen uso de herbicidas/chala?']),
    practicaCultivo: normalizeStr(row['10. ¿Qué practica de cultivo realizan?']),
    hectareasTotales: normalizeNum(row['11. ¿Cuántas hectáreas tiene tu finca?']),
    hectareasCafe: normalizeNum(row['12. ¿Cuántas hectáreas son de café?']),
    variedadesCafe: normalizeStr(row['13. ¿Qué variedades tienes en tu finca?']),
    hectareasRenovacion: normalizeNum(row['14. ¿Cuántas hectáreas tienes en renovación?']),
    areaPurma: normalizeNum(row['15. ¿Cuánto de tu área de cultivo está en Purma?']),
    areaBosque: normalizeNum(row['16. ¿Cuánto de bosque tienes? Indicar qué tipo de arboles tienes.']),
    produccion2023: normalizeNum(row['17. ¿Cuál ha sido tu producción del 2023?']),
    tipoBeneficio: normalizeStr(row['18. ¿Qué tipo de beneficio realizas?']),
    tipoSecado: tipoSecado,
    conoceTipoSuelo: knowsSuelo
      ? knowsSuelo.startsWith('SI') || knowsSuelo.startsWith('SÍ')
      : null,
    estudioSuelos: knowsSuelo,
    tanqueTina: normalizeBool(row['Tanque Tina']),
    pozoAguasMieles: normalizeBool(row['Pozo de aguas mieles']),
    secadorSolar: normalizeBool(row['Secador solar']),
    compostera: normalizeBool(row['Compostera']),
    timbosFermentacion: normalizeBool(row['Timbos de fermentacion']),
    temperaturaPromedio: normalizeNum(row['22. ¿Cuál es la temperatura promedio?']),
    tiempoSecadoDias: normalizeNum(row['23. ¿Tiempo de secado estimado? (días)']) as number | null,
    periodoCosecha: normalizeStr(row['24. Indicar el periodo de cosecha. Si puedes detallarlo por variedad.']),
    despulpadora: normalizeBool(row['25. ¿Cuentan con despulpadora en su finca?']),
    densidadSombra: normalizeStr(row['26. ¿Conoces la densidad de sombra que tiene tu finca?']),
    floraFauna: normalizeStr(row['27. ¿Qué tipo de flora y fauna hay en tu finca?']),
    metodoFertilizacion: normalizeStr(row['28. Describe tu método de fertilización']),
    practicasConservacionAmbiental: normalizeStr(row['29.¿Qué practicas de conservación ambiental realizas?']),
    breveHistoriaInicioProduccion: normalizeStr(row['BREVE HISTORIA DE INICIOS DE PRODUCCIÓN Y FINCA']),
    cosechaManejo: normalizeStr(row['Cosecha']),
    despulpado: normalizeStr(row['Despulpado']),
    fermentacion: normalizeStr(row['Fermentación']),
    secadoManejo: normalizeStr(row['Secado']),
    almacenaje: normalizeStr(row['Almacenaje']),
    bienestarLaboral: normalizeStr(row['Bienestar laboral']),
  };
}

function hasSignificantParcelaChange(existing: Partial<Parcela>, incoming: Partial<Parcela>): boolean {
  const fields: (keyof Parcela)[] = [
    'variedadesCafe',
    'hectareasRenovacion',
    'produccion2023',
  ];
  for (const f of fields) {
    const a = existing[f];
    const b = incoming[f];
    if (a !== null && b !== null && a !== undefined && b !== undefined && a !== b) return true;
  }
  return false;
}

function mergeParcelaFields(base: Partial<Parcela>, patch: Partial<Parcela>): Partial<Parcela> {
  const result = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    const key = k as keyof Parcela;
    if ((result[key] === null || result[key] === undefined) && v !== null && v !== undefined) {
      (result as Record<string, unknown>)[key] = v;
    }
  }
  return result;
}

@Injectable()
export class ExcelImportService {
  constructor(
    @InjectRepository(Productor)
    private readonly productorRepo: Repository<Productor>,
    @InjectRepository(Parcela)
    private readonly parcelaRepo: Repository<Parcela>,
    @InjectRepository(FamiliarProductor)
    private readonly familiarRepo: Repository<FamiliarProductor>,
    private readonly dataSource: DataSource,
  ) {}

  async importFromBuffer(buffer: Buffer): Promise<ImportReport> {
    const report: ImportReport = {
      productoresCreados: 0,
      productoresActualizados: 0,
      parcelasCreadas: 0,
      parcelasActualizadas: 0,
      filasFusionadasFamiliar: 0,
      filasVaciasOmitidas: 0,
      filasObservadas: 0,
      logs: [],
    };

    
    const rows = readSheet(buffer);

    
    const groups = new Map<string, RawRow[]>();
    for (const row of rows) {
      if (isRowEmpty(row)) {
        report.filasVaciasOmitidas++;
        report.logs.push(`[SKIPPED_EMPTY_ROW]`);
        continue;
      }
      const key = producerKey(row);
      if (!key) {
        report.filasVaciasOmitidas++;
        report.logs.push(`[SKIPPED_EMPTY_ROW] Fila sin DNI ni nombre reconocible`);
        continue;
      }
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(row);
    }

    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const [key, groupRows] of groups) {
        const firstRow = groupRows[0];
        const isMerged = groupRows.length > 1;

        if (isMerged) {
          report.filasFusionadasFamiliar += groupRows.length - 1;
          report.logs.push(`[MERGED_DUPLICATE_FAMILY_ROW] ${key} — ${groupRows.length} filas fusionadas`);
        }

        

        const dni = normalizeDni(firstRow['4. DNI N°']);
        const nombreCompleto = normalizeStr(firstRow['1.Nombre y Apellidos']);
        const genero = normalizeStr(firstRow['6. Género']);
        const cooperativa = normalizeStr(firstRow['9. ¿Pertenece a alguna cooperativa /empresa/asociación?']);
        const provincia = normalizeStr(firstRow['3. Provincia']);
        const region    = normalizeStr(firstRow['Región']);
        const distrito  = normalizeStr(firstRow['Distrito']);
        const codigoUbigeo = normalizeStr(firstRow['Ubigeo']) ?? normalizeStr(firstRow['Código Ubigeo']);

        const extras: string[] = [];
        if (genero)      extras.push(`Género: ${genero}`);
        if (cooperativa) extras.push(`Cooperativa: ${cooperativa}`);

        const descripcion = extras.length > 0 ? extras.join(' | ') : null;

        
        const tieneAgua = groupRows.some((r) => normalizeBool(r['Agua']) === true) || null;
        const tieneDesague = groupRows.some((r) => normalizeBool(r['Desague']) === true) || null;
        const tieneLuz = groupRows.some((r) => normalizeBool(r['Electricidad']) === true) || null;
        const tieneBanio = groupRows.some((r) => normalizeBool(r['Baño']) === true) || null;
        const tieneInternet = groupRows.some((r) => normalizeBool(r['Internet']) === true) || null;

        
        const enfermedadRaw = groupRows.map((r) => normalizeStr(r['4. ¿Hay miembros de la familia con enfermedades que requieran tratamiento o cuidados especiales?'])).find(Boolean) ?? null;
        const tieneEnfermedad = enfermedadRaw ? enfermedadRaw !== 'NO' : null;

        
        let productor: Productor | null = null;

        if (dni) {
          productor = await queryRunner.manager.findOne(Productor, {
            where: { nroDocumento: dni, activo: true },
          });
        }

        if (!productor && nombreCompleto) {
          const existing = await queryRunner.manager
            .createQueryBuilder(Productor, 'p')
            .where('p.activo = true')
            .getMany();
          productor = existing.find((p) => {
            const n = (p.nombre ?? '').trim().replace(/\s+/g, ' ').toUpperCase();
            return n === nombreCompleto;
          }) ?? null;
        }

        if (productor) {
          
          let changed = false;
          if (!productor.nroDocumento && dni) { productor.nroDocumento = dni; changed = true; }
          if (!productor.telefono && firstRow['5. Teléfono móvil']) { productor.telefono = normalizePhone(firstRow['5. Teléfono móvil']); changed = true; }
          if (!productor.email && firstRow['8. Correo electrónico']) { productor.email = normalizeStr(firstRow['8. Correo electrónico']); changed = true; }
          if (!productor.direccion && firstRow['2. Dirección']) { productor.direccion = normalizeStr(firstRow['2. Dirección']); changed = true; }
          if (!productor.descripcion && descripcion) { productor.descripcion = descripcion; changed = true; }
          if (!productor.departamento  && region)         { productor.departamento  = region;         changed = true; }
          if (!productor.provincia     && provincia)      { productor.provincia     = provincia;      changed = true; }
          if (!productor.distrito      && distrito)       { productor.distrito      = distrito;       changed = true; }
          if (!productor.codigoUbigeo  && codigoUbigeo)  { productor.codigoUbigeo  = codigoUbigeo;  changed = true; }
          if (productor.tieneAgua === null && tieneAgua !== null) { productor.tieneAgua = tieneAgua; changed = true; }
          if (productor.tieneDesague === null && tieneDesague !== null) { productor.tieneDesague = tieneDesague; changed = true; }
          if (productor.tieneLuz === null && tieneLuz !== null) { productor.tieneLuz = tieneLuz; changed = true; }
          if (productor.tieneBanio === null && tieneBanio !== null) { productor.tieneBanio = tieneBanio; changed = true; }
          if (productor.tieneInternet === null && tieneInternet !== null) { productor.tieneInternet = tieneInternet; changed = true; }
          if (productor.tieneEnfermedadEspecial === null && tieneEnfermedad !== null) { productor.tieneEnfermedadEspecial = tieneEnfermedad; changed = true; }

          if (changed) {
            await queryRunner.manager.save(Productor, productor);
            report.productoresActualizados++;
            report.logs.push(`[UPDATED_PRODUCER] ${key}`);
          }
        } else {
          
          productor = queryRunner.manager.create(Productor, {
            nombre: nombreCompleto ?? 'SIN NOMBRE',
            apellido: null,
            nroDocumento: dni,
            telefono: normalizePhone(firstRow['5. Teléfono móvil']),
            email: normalizeStr(firstRow['8. Correo electrónico']),
            direccion: normalizeStr(firstRow['2. Dirección']),
            departamento:  region         ?? null,
            provincia:     provincia      ?? null,
            distrito:      distrito       ?? null,
            codigoUbigeo:  codigoUbigeo   ?? null,
            descripcion,
            familiarEdadProductor: normalizeNum(firstRow['7. Edad']) as number | null,
            conyugeNombre: normalizeStr(firstRow['Nombre de conyuge']),
            tieneEnfermedadEspecial: tieneEnfermedad,
            enfermedadesPreexistentes: enfermedadRaw,
            tieneAgua: tieneAgua as boolean | null,
            tieneDesague: tieneDesague as boolean | null,
            tieneLuz: tieneLuz as boolean | null,
            tieneBanio: tieneBanio as boolean | null,
            tieneInternet: tieneInternet as boolean | null,
            activo: true,
            campanaId: null,
          });
          productor = await queryRunner.manager.save(Productor, productor);
          report.productoresCreados++;
          report.logs.push(`[CREATED_PRODUCER] ${key} — id=${productor.id}`);
        }

        
        
        const hijosSeenNames = new Set<string>();
        for (const row of groupRows) {
          const hijosRaw = normalizeStr(row['2. Nombres de hijos y edades']);
          if (!hijosRaw) continue;

          
          const entradas = hijosRaw.split(/[,;\/\n]+/).map((s) => s.trim()).filter(Boolean);
          for (const entrada of entradas) {
            if (hijosSeenNames.has(entrada)) continue;
            hijosSeenNames.add(entrada);

            const existingFamiliar = await queryRunner.manager.findOne(FamiliarProductor, {
              where: { productorId: productor!.id, nombres: entrada, activo: true },
            });
            if (!existingFamiliar) {
              const familiar = queryRunner.manager.create(FamiliarProductor, {
                productorId: productor!.id,
                nombres: entrada,
                apellidos: '',
                parentesco: Parentesco.HIJO,
                activo: true,
              });
              await queryRunner.manager.save(FamiliarProductor, familiar);
            }
          }
        }

        
        
        const parcelaGroups = new Map<string, RawRow[]>();
        for (const row of groupRows) {
          const nombreFinca = normalizeStr(row['1. Nombre de la Finca']) ?? '__SIN_FINCA__';
          if (!parcelaGroups.has(nombreFinca)) parcelaGroups.set(nombreFinca, []);
          parcelaGroups.get(nombreFinca)!.push(row);
        }

        for (const [fincaKey, fincaRows] of parcelaGroups) {
          if (fincaKey === '__SIN_FINCA__') continue;

          
          let parcelaData: Partial<Parcela> = {};
          for (const fRow of fincaRows) {
            parcelaData = mergeParcelaFields(parcelaData, rowToParcelaFields(fRow));
          }

          
          const existingParcelas = await queryRunner.manager.find(Parcela, {
            where: { productorId: productor!.id, activo: true },
          });
          const existingParcela = existingParcelas.find((p) => {
            const n = (p.nombreFinca ?? '').trim().replace(/\s+/g, ' ').toUpperCase();
            return n === fincaKey;
          }) ?? null;

          if (existingParcela) {
            
            if (hasSignificantParcelaChange(existingParcela as Partial<Parcela>, parcelaData)) {
              report.logs.push(`[WARNING_INCONSISTENT_PRODUCTIVE_DATA] Parcela "${fincaKey}" del productor ${key} tiene variaciones en campos productivos`);
              report.filasObservadas++;
            }
            
            const merged = mergeParcelaFields(
              existingParcela as Partial<Parcela>,
              parcelaData,
            );
            await queryRunner.manager.update(Parcela, existingParcela.id, merged);
            report.parcelasActualizadas++;
            report.logs.push(`[UPDATED_PARCELA] "${fincaKey}" productorId=${productor!.id}`);
          } else {
            
            const lastParcela = await queryRunner.manager
              .createQueryBuilder(Parcela, 'p')
              .select('p.codigo', 'codigo')
              .orderBy('p.id', 'DESC')
              .limit(1)
              .getRawOne<{ codigo: string }>();

            let codigo = 'PAR-0001';
            if (lastParcela?.codigo) {
              const match = lastParcela.codigo.match(/^PAR-(\d+)$/);
              if (match) {
                const next = parseInt(match[1], 10) + 1;
                codigo = `PAR-${String(next).padStart(4, '0')}`;
              }
            }

            const nuevaParcela = queryRunner.manager.create(Parcela, {
              ...parcelaData,
              codigo,
              productorId: productor!.id,
              activo: true,
            });
            await queryRunner.manager.save(Parcela, nuevaParcela);
            report.parcelasCreadas++;
            report.logs.push(`[CREATED_PARCELA] "${fincaKey}" productorId=${productor!.id} codigo=${codigo}`);
          }
        }
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return report;
  }
}
