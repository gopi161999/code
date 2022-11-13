import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sign(user: any) {
    return this.jwtService.sign(user, {
      secret: process.env.JWTSECRET,
      expiresIn: '1d',
    });
  }
  verify(token: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { iat, exp, ...rest } = this.jwtService.verify(token, {
      secret: process.env.JWTSECRET,
    });
    return rest;
  }
}
