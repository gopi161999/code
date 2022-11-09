import { Inject, Injectable } from '@nestjs/common';
import { User } from './typeorm';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { email, generateOTP } from './mail-service/mail-service.service';
import { PrismaService } from '../../../../libs/utils/src/lib/utils.module';
//import { sendSMSToUser } from './phone-service/phone-service.service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  OTP: string;
  constructor(
    @Inject('REDIS_SERVICE') private client: ClientProxy,
    private readonly ps: PrismaService
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<
    | User
    | {
        status: string;
        msg: string;
        data: any;
      }
  > {
    const user = await this.ps.user.findFirst({
      where: {
        name: createUserDto.username,
        email: createUserDto.email,
        password: createUserDto.password,
      },
    });
    console.log(!!user);
    if (!!user)
      return {
        status: 'ERROR',
        data: null,
        msg: 'user details already exist',
      };
    const newUser = await this.ps.user.create({
      data: {
        email: createUserDto.email,
        password: createUserDto.password,
        name: createUserDto.username,
        roles: createUserDto.roles,
      },
    });
    return {
      status: 'SUCCESS',
      data: newUser,
      msg: 'user created successfully',
    };
  }
  async update(createUserDto: CreateUserDto) {
    try {
      await this.ps.user.update({
        where: {
          email: createUserDto.email,
        },
        data: {
          email: createUserDto.email,
          password: createUserDto.password,
          name: createUserDto.username,
          roles: createUserDto.roles,
        },
      });
      return {
        status: 'SUCCESS',
        data: {},
        msg: 'user details update successfully',
      };
    } catch (e: any) {
      return {
        status: 'ERROR',
        data: e.data,
        msg: `Error in user update with ${e.message}`,
      };
    }
  }
  async getUsers() {
    return this.ps.user.findMany();
  }

  async findUsersById(id: number) {
    return await this.ps.user.findUnique({ where: { id: id } });
  }
  async findUser(username: string, password: string) {
    return await this.ps.user.findFirst({
      where: {
        name: username,
        password: password,
      },
    });
  }

  async email(user: CreateUserDto) {
    this.OTP = generateOTP();
    console.log(this.OTP);
    setTimeout(() => (this.OTP = ''), 3000);
    return await email(user, this.OTP);
  }
  passwordChange(password, email) {
    this.ps.user.update({
      where: {
        email: email,
      },
      data: {
        password: password,
      },
    });
    return {
      status: 'SUCCESS',
      data: {},
      msg: 'Password  update successfully',
    };
  }
  otpVerification(data) {
    if (this.OTP === data.otp) {
      this.passwordChange(data.newPassword, data.email);
      return {
        message: 'otp verified Successfully',
        status: 'SUCCESS',
      };
    }
    return {
      message: 'otp did not match',
      status: 'FAILED',
    };
  }
}
