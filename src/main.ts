import { NestFactory } from '@nestjs/core';
import { NextFunction, Request, Response } from 'express';
import { AppModule } from './app.module';
import {existsSync, mkdirSync} from 'fs';
import * as path from 'path'

async function bootstrap() {
  const adProjectFolder = path.join(require('app-root-path').toString(), 'ad_projects');
  if(!existsSync(adProjectFolder)) {
    mkdirSync(adProjectFolder);
  }

  const app = await NestFactory.create(AppModule);
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Cache-Control, Connection');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method == 'OPTIONS') {
      res.sendStatus(200);
    }
    else {
      next();
    }
  })
  await app.listen(3000);
}
bootstrap();
