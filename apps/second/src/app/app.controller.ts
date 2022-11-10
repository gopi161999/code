import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  @MessagePattern('second_service')
  microserviceTest(data: string) {
    return {
      data,
      msg: 'from  - second microservice!',
    };
  }
}
