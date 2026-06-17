import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { createReadStream, existsSync } from 'fs';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EvidenciasFamiliaresService } from './evidencias-familiares.service';

const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]);

const MAX_SIZE = 1 * 1024 * 1024; 

@Controller('evidencias-familiares')
@UseGuards(JwtAuthGuard)
export class EvidenciasFamiliaresController {
  constructor(private readonly svc: EvidenciasFamiliaresService) {}

  @Get()
  findAll(@Query('productorId', ParseIntPipe) productorId: number) {
    return this.svc.findByProductor(productorId);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'evidencias-familiares'),
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
          return cb(new BadRequestException('No se permiten archivos de video'), false);
        }
        if (!ALLOWED_MIME.has(file.mimetype)) {
          return cb(
            new BadRequestException(
              'Tipo de archivo no permitido. Use: PDF, Word, Excel o imágenes (jpg, png, webp)',
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: MAX_SIZE },
    }),
  )
  async upload(
    @Body('productorId') productorIdStr: string,
    @Body('nombreArchivo') nombreArchivo: string,
    @UploadedFile() file: any,
  ) {
    if (!file) throw new BadRequestException('No se recibió ningún archivo');
    const productorId = parseInt(productorIdStr, 10);
    const filePath = join('uploads', 'evidencias-familiares', file.filename);
    return this.svc.create({
      productorId,
      nombreArchivo: nombreArchivo?.trim() || file.originalname,
      filePath,
      originalFilename: file.originalname,
      mimeType:         file.mimetype ?? null,
      fileSize:         file.size     ?? null,
    });
  }

  @Get(':id/download')
  async download(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    const ev       = await this.svc.findOne(id);
    const fullPath = join(process.cwd(), ev.filePath);

    if (!existsSync(fullPath)) {
      res.status(404).json({ message: 'Archivo no encontrado en disco' });
      return;
    }

    res.set({
      'Content-Type':        ev.mimeType ?? 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(ev.nombreArchivo)}"`,
    });

    createReadStream(fullPath).pipe(res);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
