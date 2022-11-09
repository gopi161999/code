import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  @MessagePattern('first_service')
  microserviceTest(data: string): string {
    return data + ' - first microservice!';
  }
}
