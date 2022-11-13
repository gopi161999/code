/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable } from '@nestjs/common';
import { AuthService } from 'libs/token-service/src/lib/auth.token';
import { PrismaService } from '../../../../libs/utils/src/lib/utils.module';
import { v4 as uuidv4 } from 'uuid';
// import { urlAlphabet } from 'nanoid';
@Injectable()
export class AppService {
    constructor(private jwt: AuthService, private ps: PrismaService) {}
    getData(): { message: string } {
        return { message: 'Welcome to first!' };
    }
    async login(user: any) {
        console.log('HI', user);
        const vUser = await this.validateUser(
            user.data.username,
            user.data.password
        );
        // console.log(vUser);
        if (vUser) {
            const payload = {
                uid: vUser.uid,
                username: vUser.name,
                email: vUser.email,
                roles: vUser.roles,
            };
            return {
                status: 'SUCCESS',
                data: this.jwt.sign(payload),
                msg: 'Successfully login',
            };
        }
        return {
            status: 'ERROR',
            msg: 'Invalid user',
        };
    }
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.findUser(username, pass);
        if (user && user.password === pass) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async findUser(username: string, password: string) {
        return await this.ps.user.findFirst({
            where: {
                name: username,
                password: password,
            },
        });
    }
    async signup(createUserDto): Promise<{
        status: string;
        data: any;
        msg: string;
    }> {
        const user = await this.ps.user.findFirst({
            where: {
                name: createUserDto.data.username,
                email: createUserDto.data.email,
                password: createUserDto.data.password,
            },
        });
        if (user)
            return {
                status: 'ERROR',
                data: null,
                msg: 'user details already exist',
            };
        const newUser = await this.ps.user.create({
            data: {
                uid: uuidv4(),
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
    // async getUsers() {
    //   return this.ps.user.findMany();
    // }
    // async findUsersById(id: number) {
    //   return await this.ps.user.findUnique({ where: { id: id } });
    // }
}
/*
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
}*/

// const nanoid = (length: number): string => customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', length)();
