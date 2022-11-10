import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private ls: AppService) {}
  @MessagePattern('first_service')
  microserviceTest(data) {
    console.log(data);
    return {
      data,
      msg: 'from  - first microservice!',
    };
  }
  @MessagePattern('SIGNUP')
  async signUp(data) {
    return await this.ls.signup(data);
  }
  @MessagePattern('LOGIN')
  async login(data) {
    return await this.ls.login(data);
  }
}
