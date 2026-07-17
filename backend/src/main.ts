import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  
  
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Collective Bean API → http://localhost:${port}/api`);
  console.log(`📋 NODE_ENV  : ${process.env.NODE_ENV ?? 'development'}`);
  console.log(`⏳ Delay     : ${process.env.ENABLE_DELAY === 'true' ? `${process.env.DELAY_MS ?? 3000}ms` : 'disabled'}`);
}

bootstrap();
