import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, In, Not, Repository } from 'typeorm';
import { Lote, LoteEstado } from './lote.entity';
import { LoteFinal, LoteFinalEstado, LoteFinalTipoOrigen } from '../lotes-finales/lote-final.entity';
import { LoteFinalOrigen } from '../lotes-finales/lote-final-origen.entity';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { FilterLotesDto } from './dto/filter-lotes.dto';
import { DividirLoteDto } from './dto/dividir-lote.dto';
import { MezclarLotesDto } from './dto/mezclar-lotes.dto';
import { PromoverLfDto } from './dto/promover-lf.dto';
import { PaginatedResult } from '../common/interfaces/api-response.interface';
import { paginate } from '../common/helpers/pagination.helper';
import { KardexService } from '../kardex/kardex.service';
import { TipoMovimientoKardex, ReferenciaTipoKardex } from '../kardex/movimiento-kardex.entity';

@Injectable()
export class LotesService {
  constructor(
    @InjectRepository(Lote)
    private readonly loteRepo: Repository<Lote>,
    @InjectRepository(LoteFinal)
    private readonly lfRepo: Repository<LoteFinal>,
    @InjectRepository(LoteFinalOrigen)
    private readonly lfOrigenRepo: Repository<LoteFinalOrigen>,
    private readonly dataSource: DataSource,
    private readonly kardexService: KardexService,
  ) {}

  

  findAll(filter: FilterLotesDto): Promise<PaginatedResult<Lote>> {
    const where: Record<string, unknown> = { activo: true };
    if (filter.tipoProductoId) where['tipoProductoId'] = filter.tipoProductoId;
    if (filter.campanaId)      where['campanaId']      = filter.campanaId;
    if (filter.productorId)    where['productorId']    = filter.productorId;
    if (filter.estado)         where['estado']         = filter.estado;
    if (filter.search?.trim())   where['codigo']    = ILike(`%${filter.search.trim()}%`);
    if (filter.variedad?.trim()) where['variedad']  = ILike(`%${filter.variedad.trim()}%`);
    if (filter.planta?.trim()) {
      const p = filter.planta.trim();
      where['planta'] = p === 'Otro'
        ? Not(In(['CB Jaen', 'CB Lima', 'Kuska', 'Mego', 'Selva Norte']))
        : p;
    }

    return paginate(this.loteRepo, filter, {
      where,
      relations: ['tipoProducto', 'productor', 'parcela', 'campana'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Lote> {
    const lote = await this.loteRepo.findOne({
      where: { id },
      relations: ['tipoProducto', 'productor', 'parcela', 'campana', 'lotePadre'],
    });
    if (!lote) throw new NotFoundException(`Lote #${id} no encontrado`);
    return lote;
  }

  private async generateLoteCodigo(): Promise<string> {
    const year = new Date().getFullYear();
    const last = await this.loteRepo
      .createQueryBuilder('l')
      .select('l.codigo', 'codigo')
      .where('l.codigo LIKE :p', { p: `LOT-${year}-%` })
      .orderBy('l.id', 'DESC')
      .limit(1)
      .getRawOne<{ codigo: string }>();

    if (last?.codigo) {
      const match = last.codigo.match(/^LOT-\d{4}-(\d+)$/);
      if (match) {
        const next = parseInt(match[1], 10) + 1;
        return `LOT-${year}-${String(next).padStart(4, '0')}`;
      }
    }
    return `LOT-${year}-0001`;
  }

  async create(dto: CreateLoteDto): Promise<Lote> {
    const codigo = dto.codigo?.trim() || (await this.generateLoteCodigo());
    const lote = this.loteRepo.create({ ...dto, codigo });
    return this.loteRepo.save(lote);
  }

  async update(id: number, dto: UpdateLoteDto): Promise<Lote> {
    await this.findOne(id);
    await this.loteRepo.update(id, dto as Partial<Lote>);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const lote = await this.findOne(id);
    await this.loteRepo.update(id, { activo: false });
  }

  

  private async generateLfCodigo(offset = 0): Promise<string> {
    const year = new Date().getFullYear();
    const last = await this.lfRepo
      .createQueryBuilder('lf')
      .select('lf.codigo', 'codigo')
      .where('lf.codigo LIKE :p', { p: `LF-${year}-%` })
      .orderBy('lf.id', 'DESC')
      .limit(1)
      .getRawOne<{ codigo: string }>();

    if (last?.codigo) {
      const match = last.codigo.match(/^LF-\d{4}-(\d+)$/);
      if (match) {
        const next = parseInt(match[1], 10) + 1 + offset;
        return `LF-${year}-${String(next).padStart(4, '0')}`;
      }
    }
    return `LF-${year}-${String(1 + offset).padStart(4, '0')}`;
  }

  

   
  async promoverALf(id: number, dto: PromoverLfDto): Promise<LoteFinal> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const lote = await qr.manager.findOne(Lote, { where: { id } });
      if (!lote) throw new NotFoundException(`Lote #${id} no encontrado`);
      if (lote.estado === LoteEstado.PRE_ADQUISICION)
        throw new BadRequestException(`R1 — El lote #${id} está en estado PRE_ADQUISICION y no puede ser transformado. Adquiérelo primero.`);

      const codigo  = dto.codigoLf ?? await this.generateLfCodigo();
      const loteFinal = qr.manager.create(LoteFinal, {
        codigo,
        tipoProductoId: lote.tipoProductoId,
        campanaId:      lote.campanaId,
        cantidadKg:     lote.cantidadKg,
        tipoOrigen:     LoteFinalTipoOrigen.DIRECTO,
        estado:         LoteFinalEstado.PENDIENTE_TRILLADO,
        fechaCreacion:  new Date().toISOString().slice(0, 10),
      });
      const savedLf = await qr.manager.save(LoteFinal, loteFinal);

      
      await qr.manager.save(LoteFinalOrigen, qr.manager.create(LoteFinalOrigen, {
        loteFinalId:       savedLf.id,
        loteOrigenId:      lote.id,
        cantidadAportadaKg: lote.cantidadKg,
      }));

      
      await qr.manager.update(Lote, id, { estado: LoteEstado.PREPARADO });

      await qr.commitTransaction();

      
      await this.kardexService.registrar({
        loteFinalId:    savedLf.id,
        tipoMovimiento: TipoMovimientoKardex.INGRESO,
        cantidadKg:     Number(savedLf.cantidadKg),
        referenciaTipo: ReferenciaTipoKardex.AJUSTE,
        fecha:          savedLf.fechaCreacion ?? new Date().toISOString().slice(0, 10),
        observaciones:  `Ingreso por PROMOVER DIRECTO — Lote #${id}`,
      });

      return savedLf;
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  

   
  async dividir(dto: DividirLoteDto): Promise<LoteFinal[]> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      const lote = await qr.manager.findOne(Lote, { where: { id: dto.loteId } });
      if (!lote) throw new NotFoundException(`Lote #${dto.loteId} no encontrado`);
      if (lote.estado === LoteEstado.PRE_ADQUISICION)
        throw new BadRequestException(`R1 — El lote #${dto.loteId} está en estado PRE_ADQUISICION y no puede ser transformado. Adquiérelo primero.`);

      const sumaDiv = dto.divisiones.reduce((acc, d) => acc + Number(d.cantidadKg), 0);
      if (sumaDiv > Number(lote.cantidadKg) + 0.001) {
        throw new BadRequestException(
          `La suma de las divisiones (${sumaDiv} kg) supera la cantidad disponible del lote (${lote.cantidadKg} kg)`,
        );
      }

      
      let autoOffset = 0;
      for (const div of dto.divisiones) {
        if (!div.codigoLf) {
          div.codigoLf = await this.generateLfCodigo(autoOffset++);
        }
      }

      
      const codigos = dto.divisiones.map((d) => d.codigoLf!);
      if (new Set(codigos).size !== codigos.length) {
        throw new BadRequestException('Los códigos de los Lotes Finales deben ser únicos');
      }

      
      for (const codigo of codigos) {
        const existe = await qr.manager.findOne(LoteFinal, { where: { codigo } });
        if (existe) throw new ConflictException(`El código "${codigo}" ya existe`);
      }

      const nuevosLf: LoteFinal[] = [];

      for (const div of dto.divisiones) {
        const loteFinal = qr.manager.create(LoteFinal, {
          codigo:         div.codigoLf!,
          tipoProductoId: lote.tipoProductoId,
          campanaId:      lote.campanaId,
          cantidadKg:     div.cantidadKg,
          tipoOrigen:     LoteFinalTipoOrigen.DIVISION,
          estado:         LoteFinalEstado.PENDIENTE_TRILLADO,
          fechaCreacion:  new Date().toISOString().slice(0, 10),
        });
        const savedLf = await qr.manager.save(LoteFinal, loteFinal);
        nuevosLf.push(savedLf);

        await qr.manager.save(LoteFinalOrigen, qr.manager.create(LoteFinalOrigen, {
          loteFinalId:       savedLf.id,
          loteOrigenId:      lote.id,
          cantidadAportadaKg: div.cantidadKg,
        }));
      }

      
      const kgRestantes = Number(lote.cantidadKg) - sumaDiv;
      await qr.manager.update(Lote, lote.id, {
        cantidadKg: kgRestantes < 0.001 ? 0 : kgRestantes,
        estado:     kgRestantes < 0.001
          ? LoteEstado.POST_TRILLADO
          : LoteEstado.PRE_TRILLADO,
      });

      await qr.commitTransaction();

      
      const fecha = new Date().toISOString().slice(0, 10);
      for (const lf of nuevosLf) {
        await this.kardexService.registrar({
          loteFinalId:    lf.id,
          tipoMovimiento: TipoMovimientoKardex.INGRESO,
          cantidadKg:     Number(lf.cantidadKg),
          referenciaTipo: ReferenciaTipoKardex.AJUSTE,
          fecha,
          observaciones:  `Ingreso por DIVISIÓN — Lote origen #${dto.loteId}`,
        });
      }

      return nuevosLf;
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  

   
  async mezclar(dto: MezclarLotesDto): Promise<LoteFinal> {
    const qr = this.dataSource.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      
      if (!dto.codigoLf) {
        dto.codigoLf = await this.generateLfCodigo();
      }
      
      const codigoExiste = await qr.manager.findOne(LoteFinal, { where: { codigo: dto.codigoLf } });
      if (codigoExiste) throw new ConflictException(`El código "${dto.codigoLf}" ya existe`);

      
      const loteIds = [...new Set(dto.origenes.map((o) => o.loteId))];
      if (loteIds.length !== dto.origenes.length) {
        throw new BadRequestException('No se puede repetir el mismo lote como origen en una mezcla');
      }

      const lotes: Lote[] = [];
      for (const origen of dto.origenes) {
        const lote = await qr.manager.findOne(Lote, { where: { id: origen.loteId } });
        if (!lote) throw new NotFoundException(`Lote #${origen.loteId} no encontrado`);
        if (lote.estado === LoteEstado.PRE_ADQUISICION)
          throw new BadRequestException(`R1 — El lote #${origen.loteId} está en estado PRE_ADQUISICION y no puede participar en una mezcla. Adquiérelo primero.`);

        if (Number(origen.cantidadKg) > Number(lote.cantidadKg) + 0.001) {
          throw new BadRequestException(
            `Se solicitan ${origen.cantidadKg} kg del Lote #${origen.loteId}, pero solo tiene ${lote.cantidadKg} kg disponibles`,
          );
        }

        lotes.push(lote);
      }

      
      const tiposUnicos = [...new Set(lotes.map((l) => l.tipoProductoId))];
      if (tiposUnicos.length > 1) {
        throw new BadRequestException(
          `R7 — No se pueden mezclar lotes de distintos tipos de producto. Tipos encontrados: ${tiposUnicos.join(', ')}`,
        );
      }

      const totalKg  = dto.origenes.reduce((acc, o) => acc + Number(o.cantidadKg), 0);
      const campanaId = dto.campanaId ?? lotes[0].campanaId;

      
      const loteFinal = qr.manager.create(LoteFinal, {
        codigo:         dto.codigoLf,
        tipoProductoId: tiposUnicos[0],
        campanaId,
        cantidadKg:     totalKg,
        tipoOrigen:     LoteFinalTipoOrigen.MEZCLA,
        estado:         LoteFinalEstado.PENDIENTE_TRILLADO,
        fechaCreacion:  new Date().toISOString().slice(0, 10),
      });
      const savedLf = await qr.manager.save(LoteFinal, loteFinal);

      
      for (const origen of dto.origenes) {
        const lote = lotes.find((l) => l.id === origen.loteId)!;

        await qr.manager.save(LoteFinalOrigen, qr.manager.create(LoteFinalOrigen, {
          loteFinalId:       savedLf.id,
          loteOrigenId:      lote.id,
          cantidadAportadaKg: origen.cantidadKg,
        }));

        const kgRestantes = Number(lote.cantidadKg) - Number(origen.cantidadKg);
        await qr.manager.update(Lote, lote.id, {
          cantidadKg: kgRestantes < 0.001 ? 0 : kgRestantes,
          estado:     kgRestantes < 0.001
            ? LoteEstado.POST_TRILLADO
            : LoteEstado.PRE_TRILLADO,
        });
      }

      await qr.commitTransaction();

      
      await this.kardexService.registrar({
        loteFinalId:    savedLf.id,
        tipoMovimiento: TipoMovimientoKardex.INGRESO,
        cantidadKg:     Number(savedLf.cantidadKg),
        referenciaTipo: ReferenciaTipoKardex.AJUSTE,
        fecha:          savedLf.fechaCreacion ?? new Date().toISOString().slice(0, 10),
        observaciones:  `Ingreso por MEZCLA — lotes origen: ${dto.origenes.map((o) => `#${o.loteId}`).join(', ')}`,
      });

      return savedLf;
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  

   
  async findLotesFinalesDeOrigen(loteId: number): Promise<LoteFinalOrigen[]> {
    await this.findOne(loteId);
    return this.lfOrigenRepo.find({
      where: { loteOrigenId: loteId },
      relations: ['loteFinal', 'loteFinal.tipoProducto'],
      order: { createdAt: 'ASC' },
    });
  }
}
