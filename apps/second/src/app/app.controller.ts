import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
    @MessagePattern('second_service')
    microserviceTest(data: string) {
        console.log('second', data);
        return {
            data: 'done2',
            ststus: 'SUCCESS',
            msg: 'from  - second microservice!',
        };
    }
    @MessagePattern('f_society')
    microserviceF(data: string) {
        console.log('second', data);
        return {
            data: 'mr.robot',
            ststus: 'SUCCESS',
            msg: 'from the new header named as f society ',
        };
    }
}
