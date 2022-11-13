import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private ls: AppService) {}
    @MessagePattern('f_service')
    microserviceTest(data) {
        //console.log(data);
        return {
            data: 'done1',
            ststus: 'SUCCESS',
            msg: 'from  - first microservice!',
        };
    }
    @MessagePattern('service')
    merviceTest(data) {
        // console.log(data);
        return {
            data: 'done3',
            ststus: 'SUCCESS',
            msg: 'from  - service!',
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
