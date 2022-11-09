import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UsersService } from './app.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Roles } from './authorization/roles.decorator';
import { Role } from './authorization/role.enum';
import { MessagePattern } from '@nestjs/microservices';
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private authService: AuthService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Body() body) {
    return this.authService.login(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @Roles(Role.Admin)
  getUsers() {
    return this.userService.getUsers();
  }
  @UseGuards(JwtAuthGuard)
  @Get('id/:id')
  @Roles(Role.Admin)
  findUsersById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUsersById(id);
  }
  @MessagePattern('A')
  // @Post('create')
  @UsePipes(ValidationPipe)
  async createUsers(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }
  @Post('update')
  async update(@Body() createUserDto: CreateUserDto) {
    return await this.userService.update(createUserDto);
  }
  @Post('email')
  passwordRest(@Body() createUserDto: CreateUserDto) {
    return this.userService.email(createUserDto);
  }
  @Post('e-otp')
  EmailotpVerifation(@Body() body: any) {
    return this.userService.otpVerification(body);
  }
}
