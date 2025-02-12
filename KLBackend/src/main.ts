import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from "express";
import { join } from "path";
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
  })
  app.use("/uploads", express.static(join(__dirname, "..", "uploads"))); // Serve images
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });

  await app.listen(process.env.PORT ?? 3300, '0.0.0.0');
}
bootstrap();
