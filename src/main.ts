import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';
const multer = require('multer');
const upload = multer({dest: 'images/'}) // dest : 저장 위치

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync('../../key.pem'),
    cert: readFileSync('../../cert.pem')
  }
  const app = await NestFactory.create(AppModule, {
    httpsOptions
  });

  app.enableCors();
  await app.listen(3000);
}
bootstrap();
