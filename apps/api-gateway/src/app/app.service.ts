/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from 'libs/token-service/src/lib/auth.token';
@Injectable()
export class AppService {
  constructor(private jwt: AuthService) {}
  getData(): { message: string } {
    return { message: 'Welcome to api-gateway!' };
  }
  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
    }
    const token = auth.split(' ')[1];
    try {
      const decoded = this.jwt.verify(token);
      return decoded;
    } catch (err) {
      const message = 'Token error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}
