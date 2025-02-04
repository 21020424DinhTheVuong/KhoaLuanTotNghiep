import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from "express";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true
  })
  app.use("/uploads", express.static(join(__dirname, "..", "uploads"))); // Serve images

  await app.listen(process.env.PORT ?? 3300, '0.0.0.0');
}
bootstrap();
