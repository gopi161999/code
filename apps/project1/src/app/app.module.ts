import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../../libs/utils/src/lib/utils.module';
import { UsersController } from './app.controller';
import { UsersService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { LocalStrategy } from './auth/local.strategy';
import { RolesGuard } from './authorization/roles.guard';
import { ClientsModule, Transport } from '@nestjs/microservices';
@Module({
  imports: [],
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    AuthService,
    JwtService,
    LocalStrategy,
    JwtStrategy,
    RolesGuard,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
