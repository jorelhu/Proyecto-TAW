import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Permitir que Vite (frontend) se conecte
  app.enableCors({
    origin: 'http://localhost:5173',
    // URL del frontend
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
