import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Logger,
  Post,
  Headers,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';
import { firstValueFrom } from 'rxjs';
import { tokenNeedHeaders, tokenNotNeedHeaders } from './route.utlis';
import { IGatewayPayload } from './  gatewayPayload';
@Controller()
export class AppController {
  private logger;
  constructor(
    @Inject('REDIS_SERVICE') private readonly firstClient: ClientProxy,
    private readonly appService: AppService
  ) {
    this.logger = new Logger('GATEWAY_CONTROLLER');
  }

  @Get('')
  healthCheck() {
    this.logger.log(`Called the GET Health Check Route.`);
    return HttpStatus.OK;
  }
  @Post('')
  async testFirstService(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Body() payload: IGatewayPayload<any, any>,
    @Headers('route') routeHeader: string,
    @Headers('authentication') token: string
  ) {
    // console.log(routeHeader, token);
    // console.log(payload);
    const authNeed = tokenNeedHeaders.some((header) =>
      routeHeader?.includes(header)
    );
    const authNoNeed = tokenNotNeedHeaders.some((header) =>
      routeHeader?.includes(header)
    );
    // console.log(authNeed, authNoNeed);
    if (authNeed && !authNoNeed) {
      await this.appService.validateToken(token);
    }
    if (!authNeed && !authNoNeed) {
      return {
        status: 'ERROR',
        msg: 'Route not register',
      };
    }
    return {
      data: await firstValueFrom(this.firstClient.send(routeHeader, payload)),
    };
  }
}
//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
