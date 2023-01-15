import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    // Remove every elements not defined in the DTO
    whitelist: true,
  }));

  app.enableCors({
    origin: ['http://localhost:4200'],
    // methods: ['GET', 'POST', 'HEAD'],
    credentials: true,
  });

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  await app.listen(3000);
}

bootstrap();
