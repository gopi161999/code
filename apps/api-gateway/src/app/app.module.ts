/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokenServiceModule } from 'libs/token-service/src';
import { AuthService } from 'libs/token-service/src/lib/auth.token';
@Module({
  imports: [
    TokenServiceModule,
    ClientsModule.register([
      {
        name: 'REDIS_SERVICE',
        transport: Transport.REDIS,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, AuthService],
})
export class AppModule {}
