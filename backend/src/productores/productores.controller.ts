import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductoresService } from './productores.service';
import { ExcelImportService } from './excel-import.service';
import { CreateProductorDto } from './dto/create-productor.dto';
import { UpdateProductorDto } from './dto/update-productor.dto';
import { CloneProductorDto } from './dto/clone-productor.dto';
import { FilterProductoresDto } from './dto/filter-productores.dto';

@UseGuards(JwtAuthGuard)
@Controller('productores')
export class ProductoresController {
  constructor(
    private readonly service: ProductoresService,
    private readonly importService: ExcelImportService,
  ) {}

  @Get()
  findAll(@Query() filter: FilterProductoresDto) {
    return this.service.findAll(filter);
  }

   
  @Post('importar-excel')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (_req, file, cb) => {
        if (!file.originalname.match(/\.(xlsx|xls)$/i)) {
          return cb(new BadRequestException('Solo se permiten archivos Excel (.xlsx, .xls)'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 20 * 1024 * 1024 }, 
    }),
  )
  async importarExcel(
    @UploadedFile() file: { buffer: Buffer; originalname: string; mimetype: string },
  ) {
    if (!file) throw new BadRequestException('No se recibió ningún archivo');
    return this.importService.importFromBuffer(file.buffer);
  }

   
  @Post('upload-foto')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/productores',
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
          return cb(
            new BadRequestException(
              'Solo se permiten imágenes (jpg, png, gif, webp)',
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, 
    }),
  )
  
  uploadFoto(@UploadedFile() file: any) {
    if (!file) throw new BadRequestException('No se recibió ningún archivo');
    return { url: `/uploads/productores/${file.filename}` };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProductorDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductorDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Post(':id/clonar')
  clone(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CloneProductorDto,
  ) {
    return this.service.clone(id, dto);
  }
}
