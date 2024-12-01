import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { BaseResponse } from '../../common/response/base.response';
import { BusinessCode } from '../../common/response/response.enum';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUser(userId: string) {
    const user = await this.userRepository.findOne({ _id: userId });
    return BaseResponse.success({
      businessCode: BusinessCode.OK,
      businessDescription: 'User Fetched Successfully',
      data: user,
    });
  }
}
