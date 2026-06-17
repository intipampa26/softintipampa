import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoProducto } from './tipo-producto.entity';
import { TiposProductoService } from './tipos-producto.service';
import { TiposProductoController } from './tipos-producto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TipoProducto])],
  controllers: [TiposProductoController],
  providers: [TiposProductoService],
  exports: [TypeOrmModule, TiposProductoService],
})
export class TiposProductoModule {}
