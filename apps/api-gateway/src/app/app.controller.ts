/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    Headers,
} from '@nestjs/common';
import { AppService } from './app.service';
import { MyLogger } from 'libs/my-logger/src/lib/logger';
import { IncomingHeaders } from './route.utlis';
// import { IGatewayPayload } from './gatewayPayload';
@Controller()
export class AppController {
    private logger: MyLogger;
    constructor(private readonly appService: AppService) {
        this.logger = new MyLogger('GATEWAY_CONTROLLER');
    }

    @Get('')
    healthCheck() {
        // this.logger.log();
        return HttpStatus.OK;
    }
    @Post('')
    async gatewayController(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        @Body() payload: any,
        @Headers('route') routeHeader: string,
        @Headers('authentication') token: string
    ) {
        // console.log(routeHeader, token);
        //console.log(JSON.stringify(payload));
        const reqId = this.appService.generateReqId();
        console.log(payload);
        this.logger.debug(
            reqId,
            `${routeHeader} is caled with Payload ${JSON.stringify(payload)}`
        );
        const vHeader = Object.keys(IncomingHeaders).some((header) =>
            routeHeader?.includes(header)
        );
        if (!vHeader) {
            this.logger.error(reqId, 'Route not register');
            return {
                status: 'ERROR',
                msg: 'Route not register',
            };
        }
        return await this.appService.exeHeader(
            routeHeader,
            payload,
            token,
            reqId
        );
    }
}
//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
