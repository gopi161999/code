import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { firstValueFrom } from 'rxjs';
@Controller()
export class AppController {
  constructor(
    @Inject('REDIS_SERVICE') private readonly firstClient: ClientProxy,
    private readonly appService: AppService
  ) {}

  @Get('')
  async testFirstService() {
    return {
      data: await firstValueFrom(
        this.firstClient.send('first_service', 'Message from')
      ),
    };
  }
}
