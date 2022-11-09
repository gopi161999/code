/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Transport } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.REDIS,
    options: {
      url: `redis://${'localhost'}:${'6379'}`,
    },
  });
  await app.listen();
  Logger.log(`🚀 Application is running on redis://${'localhost'}:${'6379'}`);
}

bootstrap();
