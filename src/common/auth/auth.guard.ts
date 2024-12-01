import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './jwt.strategy';
import { UserRepository } from 'src/apps/user/repository/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);


    if (isPublic) {
      return true;
    }

    const token =  request.cookies._session
    if (!token) {
      throw new UnauthorizedException('Authentication token is missing');
    }
    try {
      if (token) {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get("JWT_SECRET")
        });
        
        const user = await this.userRepository.findById(payload.sub)
        request['user_id'] = user._id;
      }
    } catch (e) {
      throw new UnauthorizedException('Invalid token, Token has Expire');
    }
    return true;
  }

}
