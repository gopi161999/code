/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'libs/token-service/src/lib/auth.token';
import { IGatewayPayload } from './gatewayPayload';
import { IncomingHeaders } from './route.utlis';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { IResponse, permission } from './interface';
import { customAlphabet, urlAlphabet } from 'nanoid';
import { MyLogger } from 'libs/my-logger/src/lib/logger';
@Injectable()
export class AppService {
    private logger: MyLogger;
    constructor(
        private jwt: AuthService,
        @Inject('REDIS_SERVICE') private readonly client: ClientProxy
    ) {
        this.logger = new MyLogger('GATEWAY_SERVICE');
    }
    getData(): { message: string } {
        return { message: 'Welcome to api-gateway!' };
    }
    async validateToken(auth: string) {
        if (!auth)
            throw new HttpException(
                'Authetication token missing',
                HttpStatus.FORBIDDEN
            );
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
    async exeHeader(
        header: string,
        payload: any,
        token: string,
        reqId: string
    ): Promise<IResponse<unknown>> {
        try {
            const data: IGatewayPayload<unknown, unknown> = {
                data: payload,
                requestId: reqId,
                user: null,
            };
            const exeHeaders = IncomingHeaders[header];
            const obj = {};
            for (let i = 0; i < exeHeaders.length; ) {
                this.logger.log(
                    reqId,
                    `Path [${exeHeaders[i].header}] with RequestId [${reqId}]`
                );
                let user = null;
                if (exeHeaders[i].auth) {
                    user = await this.authentication(
                        token,
                        exeHeaders[i].permission,
                        reqId
                    );
                }
                data.user = user;
                const resp = await this.sendtoClient(
                    exeHeaders[i].header,
                    data
                );
                obj[exeHeaders[i].doneWith] = resp;
                if (resp.ststus == 'SUCCESS') {
                    data.parentData = resp.data;
                    i++;
                } else break;
            }
            //console.log(data);
            return {
                status: 'SUCCESS',
                data: obj,
                msg: 'Successfully Completed',
            };
        } catch (e) {
            return { status: 'ERROR', data: null, msg: e.message };
        }
    }
    async sendtoClient(
        routeHeader: string,
        payload: IGatewayPayload<unknown, unknown>
    ) {
        return await firstValueFrom(this.client.send(routeHeader, payload));
    }

    async authentication(token: string, allowed: string, reqId: string) {
        this.logger.log(reqId, `Authentication called with [${reqId}]`);
        const user = await this.validateToken(token);
        if (this.authorization(user.roles, allowed, reqId)) return user;
        return;
    }
    authorization(role: string, allowed: string, reqId: string) {
        //console.log(allowed, role);
        if (!allowed) return true;
        if (!permission[allowed].some((v) => v?.includes(role))) {
            throw new HttpException('Not accessable', HttpStatus.FORBIDDEN);
        }
        this.logger.log(reqId, `Authorization called`);
        return true;
    }
    generateReqId() {
        return customAlphabet(urlAlphabet, 20)();
    }
}
