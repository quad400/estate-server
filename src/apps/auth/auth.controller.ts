import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from '../../common/auth/jwt.strategy';
import { Response } from 'express';
import { LoginUserDto } from './dto/login.dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() data: CreateUserDto) {
    return await this.authService.create(data);
  }

  @Post('login')
  async login(@Body() data: LoginUserDto, @Res() res: Response) {
    return await this.authService.login(data, res)
  }

  @Post("logout")
  async logout(@Res() res: Response){
    return await this.authService.logout(res)
  }
}
