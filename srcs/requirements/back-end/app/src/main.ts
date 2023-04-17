import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:3000'],
    credentials: true,
  });

  const options = new DocumentBuilder()
    .setTitle('ft_transcendence')
    .setDescription('The API called for ft_transcendence')
    .addCookieAuth(
        'access_token',
        {
            type: 'http',
            in: 'cookie',
            name: 'access_token',
            description: 'Cookie access_token',
        },
    )
    .setVersion('0.1')
    .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/docs', app, document);

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  await app.listen(3000);
}

bootstrap();
