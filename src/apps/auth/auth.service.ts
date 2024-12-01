import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../user/repository/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseResponse } from '../../common/response/base.response';
import { BusinessCode } from '../../common/response/response.enum';
import { JwtService } from '@nestjs/jwt';
import { Response} from "express"
import { LoginUserDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async create(data: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);
    // const clerk_user = await clerkClient.users.createUser({

    // });

    data.password = await bcrypt.hash(data.password, salt);

    await this.userRepository.checkUnique(data, 'email');

    const user = await this.userRepository.create(data);


    return BaseResponse.success({
      businessCode: BusinessCode.CREATED,
      businessDescription: 'User created successfully',
    });
  }

  async login(data: LoginUserDto, res: Response) {
    const { email, password } = data;
    
    const user = await this.userRepository.findOneWithPassword({ email });
    
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }
    const token = this.jwtService.sign({ sub: user });

    res.cookie("_session", token, {
      maxAge: 30 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/"
    })

    return res.json({
      businessCode: BusinessCode.OK,
      businessDescription: 'User successfully logged in',
    });
  }
  
  async logout(res: Response){
    res.clearCookie("_session", {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",    
    })
    
    return res.json({
      businessCode: BusinessCode.OK,
      businessDescription: 'User successfully logged out',
     });
  }
}
