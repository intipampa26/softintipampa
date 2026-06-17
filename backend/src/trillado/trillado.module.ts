import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trillado } from './trillado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trillado])],
  exports: [TypeOrmModule],
})
export class TrilladoModule {}
