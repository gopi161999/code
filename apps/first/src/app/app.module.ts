/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { TokenServiceModule } from 'libs/token-service/src';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from 'libs/token-service/src/lib/auth.token';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'libs/utils/src/lib/utils.module';
@Module({
  imports: [TokenServiceModule],
  controllers: [AppController],
  providers: [AppService, JwtService, AuthService, PrismaService],
})
export class AppModule {}
