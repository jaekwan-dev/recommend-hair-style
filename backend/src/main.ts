import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Vite 기본 포트
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 글로벌 파이프 설정
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('HairMatch API')
    .setDescription('AI-powered hair style recommendation service API')
    .setVersion('1.0')
    .addTag('face-analysis')
    .addTag('recommendations')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 HairMatch Backend Server running on: http://localhost:${port}`);
  console.log(`📖 Swagger API documentation: http://localhost:${port}/api`);
}

bootstrap(); 