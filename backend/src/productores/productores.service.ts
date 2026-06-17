import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Productor } from './productor.entity';
import { Campana } from '../campanas/campana.entity';
import { CreateProductorDto } from './dto/create-productor.dto';
import { UpdateProductorDto } from './dto/update-productor.dto';
import { CloneProductorDto } from './dto/clone-productor.dto';
import { FilterProductoresDto } from './dto/filter-productores.dto';
import { CampanasService } from '../campanas/campanas.service';
import { PaginatedResult } from '../common/interfaces/api-response.interface';
import { FamiliarProductor } from '../familiares-productor/familiar-productor.entity';

export type ProductorConCampanas = Productor & { campanasActivas?: Campana[] };

 
const SYNC_EXCLUDE = new Set(['campanaId', 'activo', 'clonedFromId']);

 
function uniqueKey(p: Productor): string {
  const doc = (p.nroDocumento ?? '').trim().toLowerCase();
  const nom = (p.nombre ?? '').trim().toLowerCase();
  const ape = (p.apellido ?? '').trim().toLowerCase();
  return `${doc}|${nom}|${ape}`;
}

@Injectable()
export class ProductoresService {
  constructor(
    @InjectRepository(Productor)
    private readonly repo: Repository<Productor>,
    @InjectRepository(FamiliarProductor)
    private readonly familiaresRepo: Repository<FamiliarProductor>,
    private readonly campanasService: CampanasService,
  ) {}

  async findAll(filter: FilterProductoresDto): Promise<PaginatedResult<ProductorConCampanas>> {
    
    if (filter.campanaId) {
      
      const enCampana = await this.repo.find({
        where: { activo: true, campanaId: filter.campanaId },
      });
      if (enCampana.length === 0) {
        return { data: [], meta: { total: 0, page: filter.page, lastPage: 1, limit: filter.limit } };
      }
      const keysEnCampana = new Set(enCampana.map(uniqueKey));

      
      const todos = await this.repo.find({
        where: { activo: true },
        relations: ['campana'],
        order: { id: 'ASC' },
      });

      
      const seen = new Map<string, ProductorConCampanas>();
      for (const p of todos) {
        const key = uniqueKey(p);
        if (seen.has(key)) {
          const rep = seen.get(key)!;
          if (p.campana && !rep.campanasActivas!.some((c) => c.id === p.campana!.id)) {
            rep.campanasActivas!.push(p.campana);
          }
        } else {
          seen.set(key, { ...p, campanasActivas: p.campana ? [p.campana] : [] });
        }
      }

      
      let deduped = Array.from(seen.values()).filter((p) => keysEnCampana.has(uniqueKey(p)));

      
      if (filter.nroDocumento?.trim()) {
        const term = filter.nroDocumento.trim().toLowerCase();
        deduped = deduped.filter((p) => (p.nroDocumento ?? '').toLowerCase().includes(term));
      }
      if (filter.search?.trim()) {
        const term = filter.search.trim().toLowerCase();
        deduped = deduped.filter(
          (p) =>
            (p.nombre ?? '').toLowerCase().includes(term) ||
            (p.apellido ?? '').toLowerCase().includes(term),
        );
      }
      if (filter.tipoProductor?.trim()) {
        deduped = deduped.filter((p) => p.tipoProductor === filter.tipoProductor);
      }
      if (filter.departamento?.trim()) {
        const dep = filter.departamento.trim().toLowerCase();
        deduped = deduped.filter((p) => (p.departamento ?? '').toLowerCase() === dep);
      }
      if (filter.tipoProducto?.trim()) {
        deduped = deduped.filter((p) => p.tipoProducto === filter.tipoProducto);
      }

      deduped.sort((a, b) => {
        const ap = `${a.apellido ?? ''} ${a.nombre}`.toLowerCase();
        const bp = `${b.apellido ?? ''} ${b.nombre}`.toLowerCase();
        return ap.localeCompare(bp);
      });

      const total = deduped.length;
      const lastPage = Math.ceil(total / filter.limit) || 1;
      const start = (filter.page - 1) * filter.limit;
      const data = deduped.slice(start, start + filter.limit);
      return { data, meta: { total, page: filter.page, lastPage, limit: filter.limit } };
    }

    const todos = await this.repo.find({
      where: { activo: true },
      relations: ['campana'],
      order: { id: 'ASC' }, 
    });

    const seen = new Map<string, ProductorConCampanas>();
    for (const p of todos) {
      const key = uniqueKey(p);
      if (seen.has(key)) {
        
        const rep = seen.get(key)!;
        if (p.campana && !rep.campanasActivas!.some((c) => c.id === p.campana!.id)) {
          rep.campanasActivas!.push(p.campana);
        }
      } else {
        seen.set(key, { ...p, campanasActivas: p.campana ? [p.campana] : [] });
      }
    }

    let deduped = Array.from(seen.values());

    
    if (filter.nroDocumento?.trim()) {
      const term = filter.nroDocumento.trim().toLowerCase();
      deduped = deduped.filter((p) => (p.nroDocumento ?? '').toLowerCase().includes(term));
    }
    if (filter.search?.trim()) {
      const term = filter.search.trim().toLowerCase();
      deduped = deduped.filter(
        (p) =>
          (p.nombre ?? '').toLowerCase().includes(term) ||
          (p.apellido ?? '').toLowerCase().includes(term),
      );
    }
    if (filter.tipoProductor?.trim()) {
      deduped = deduped.filter((p) => p.tipoProductor === filter.tipoProductor);
    }
    if (filter.departamento?.trim()) {
      const dep = filter.departamento.trim().toLowerCase();
      deduped = deduped.filter((p) => (p.departamento ?? '').toLowerCase() === dep);
    }
    if (filter.tipoProducto?.trim()) {
      deduped = deduped.filter((p) => p.tipoProducto === filter.tipoProducto);
    }

    deduped.sort((a, b) => {
      const ap = `${a.apellido ?? ''} ${a.nombre}`.toLowerCase();
      const bp = `${b.apellido ?? ''} ${b.nombre}`.toLowerCase();
      return ap.localeCompare(bp);
    });

    const total = deduped.length;
    const lastPage = Math.ceil(total / filter.limit) || 1;
    const start = (filter.page - 1) * filter.limit;
    const data = deduped.slice(start, start + filter.limit);

    return { data, meta: { total, page: filter.page, lastPage, limit: filter.limit } };
  }

  async findOne(id: number): Promise<ProductorConCampanas> {
    const productor = await this.repo.findOne({
      where: { id },
      relations: ['campana'],
    });
    if (!productor) throw new NotFoundException(`Productor #${id} no encontrado`);

    
    const todos = await this.repo.find({ where: { activo: true }, relations: ['campana'] });
    const key = uniqueKey(productor);
    const campanasActivas: Campana[] = [];
    const seen = new Set<number>();
    for (const p of todos) {
      if (uniqueKey(p) === key && p.campana && !seen.has(p.campana.id)) {
        campanasActivas.push(p.campana);
        seen.add(p.campana.id);
      }
    }

    return { ...productor, campanasActivas };
  }

  async create(dto: CreateProductorDto): Promise<Productor> {
    if (dto.campanaId) await this.campanasService.findOne(dto.campanaId);
    const productor = this.repo.create(dto);
    const saved = await this.repo.save(productor);
    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateProductorDto): Promise<Productor> {
    await this.findOne(id);
    await this.repo.update(id, dto);

    
    const syncPayload: Partial<UpdateProductorDto> = {};
    for (const key of Object.keys(dto) as (keyof UpdateProductorDto)[]) {
      if (!SYNC_EXCLUDE.has(key) && dto[key] !== undefined) {
        (syncPayload as Record<string, unknown>)[key] = dto[key];
      }
    }

    if (Object.keys(syncPayload).length > 0) {
      const clones = await this.repo.find({
        where: { clonedFromId: id, activo: true },
      });
      for (const clon of clones) {
        await this.repo.update(clon.id, syncPayload);
      }
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.repo.update(id, { activo: false });
  }

  async clone(id: number, dto: CloneProductorDto): Promise<Productor> {
    const origen = await this.findOne(id);

    if (origen.campanaId === dto.campanaDestinoId) {
      throw new BadRequestException(
        'La campaña destino debe ser diferente a la campaña origen',
      );
    }

    await this.campanasService.findOne(dto.campanaDestinoId);

    if (origen.nroDocumento) {
      const existente = await this.repo.findOne({
        where: {
          campanaId: dto.campanaDestinoId,
          nroDocumento: origen.nroDocumento,
          activo: true,
        },
      });
      if (existente) {
        throw new BadRequestException(
          `Ya existe un productor con documento "${origen.nroDocumento}" en la campaña destino`,
        );
      }
    }

    const clon = this.repo.create({
      nombre:       origen.nombre,
      apellido:     origen.apellido,
      nroDocumento: origen.nroDocumento,
      fecha:        origen.fecha,
      telefono:     origen.telefono,
      fotoUrl:      origen.fotoUrl,
      email:        origen.email,
      descripcion:  origen.descripcion,
      direccion:    origen.direccion,
      tipoProducto: origen.tipoProducto,
      esApto:       origen.esApto,
      
      familiarNombreProductor:   origen.familiarNombreProductor,
      familiarEdadProductor:     origen.familiarEdadProductor,
      familiarEstadoCivil:       origen.familiarEstadoCivil,
      familiarGradoInstruccion:  origen.familiarGradoInstruccion,
      conyugeNombre:             origen.conyugeNombre,
      conyugeEdad:               origen.conyugeEdad,
      conyugeOcupacion:          origen.conyugeOcupacion,
      conyugeGradoInstruccion:   origen.conyugeGradoInstruccion,
      hijosData:                 origen.hijosData,
      enfermedadesPreexistentes: origen.enfermedadesPreexistentes,
      seguroMedico:              origen.seguroMedico,
      
      tieneAgua:    origen.tieneAgua,
      tieneDesague: origen.tieneDesague,
      tieneLuz:     origen.tieneLuz,
      tieneInternet:origen.tieneInternet,
      tieneBanio:   origen.tieneBanio,
      
      clonedFromId: id,
      activo:       true,
      campanaId:    dto.campanaDestinoId,
    });

    const saved = await this.repo.save(clon);

    
    const familiaresOrigen = await this.familiaresRepo.find({
      where: { productorId: id },
    });
    if (familiaresOrigen.length > 0) {
      const familiaresClon = familiaresOrigen.map((f) =>
        this.familiaresRepo.create({
          productorId:     saved.id,
          nombres:         f.nombres,
          apellidos:       f.apellidos,
          parentesco:      f.parentesco,
          sexo:            f.sexo,
          fechaNacimiento: f.fechaNacimiento,
          tipoDocumento:   f.tipoDocumento,
          nroDocumento:    f.nroDocumento,
          telefono:        f.telefono,
          correo:          f.correo,
          direccion:       f.direccion,
          observaciones:   f.observaciones,
          activo:          f.activo,
        }),
      );
      await this.familiaresRepo.save(familiaresClon);
    }

    return this.findOne(saved.id);
  }
}
