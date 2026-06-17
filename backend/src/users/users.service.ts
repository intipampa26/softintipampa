import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResult } from '../common/interfaces/api-response.interface';
import { paginate } from '../common/helpers/pagination.helper';

interface CreateUserData {
  username: string;
  password: string;
  role?: UserRole;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username, isActive: true } });
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return user;
  }

  async create(data: CreateUserData): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: { username: data.username },
    });
    if (existing) throw new ConflictException('El nombre de usuario ya existe');

    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResult<Omit<User, 'password'>>> {
    const result = await paginate(this.usersRepository, pagination, {
      order: { createdAt: 'DESC' },
    });
    return {
      data: result.data.map(({ password: _pwd, ...rest }) => rest as Omit<User, 'password'>),
      meta: result.meta,
    };
  }

  async update(
    id: number,
    data: { username?: string; password?: string; role?: UserRole; isActive?: boolean },
  ): Promise<Omit<User, 'password'>> {
    const user = await this.findById(id);

    if (data.username && data.username !== user.username) {
      const existing = await this.usersRepository.findOne({ where: { username: data.username } });
      if (existing) throw new ConflictException('El nombre de usuario ya existe');
    }

    const updatePayload: Partial<User> = {};
    if (data.username !== undefined) updatePayload.username = data.username;
    if (data.role !== undefined) updatePayload.role = data.role;
    if (data.isActive !== undefined) updatePayload.isActive = data.isActive;
    if (data.password) {
      updatePayload.password = await bcrypt.hash(data.password, 10);
    }

    await this.usersRepository.update(id, updatePayload);
    const updated = await this.findById(id);
    const { password: _pwd, ...rest } = updated;
    return rest as Omit<User, 'password'>;
  }

  async deactivate(id: number): Promise<void> {
    await this.findById(id);
    await this.usersRepository.update(id, { isActive: false });
  }
}
