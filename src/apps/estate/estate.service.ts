import { Injectable } from '@nestjs/common';
import { EstateRepository } from './repository/estate.repository';
import { CreateEstateDto, UpdateEstateDto } from './dto/estate.dto';
import { UserRepository } from '../user/repository/user.repository';
import { AgentRepository } from '../agent/repository/agent.repository';
import { BaseResponse } from '../../common/response/base.response';
import { BusinessCode } from '../../common/response/response.enum';
import { QueryDto } from '../../common/query.dto';
import { CreateFeedbackDto, UpdateFeedbackDto } from './dto/feedback.dto';
import { FeedbackRepository } from './repository/feedback.repository';

@Injectable()
export class EstateService {
  constructor(
    private readonly estateRepository: EstateRepository,
    private readonly userRepository: UserRepository,
    private readonly agentRepository: AgentRepository,
    private readonly feedbackRepository: FeedbackRepository,
  ) {}

  async createEstate(userId: string, body: CreateEstateDto) {
    const agent = await this.agentRepository.findOne({
      user: userId,
    });

    await this.estateRepository.create({ ...body, agent: agent._id });
    return BaseResponse.success({
      businessCode: BusinessCode.CREATED,
      businessDescription: 'Estate Created Successfully',
    });
  }

  async getEstate(estateId: string) {
    const estate = await (
      await this.estateRepository.findById(estateId)
    ).populate('agent');
    return BaseResponse.success({
      businessCode: BusinessCode.OK,
      businessDescription: 'Estate Fetched Successfully',
      data: estate,
    });
  }

  async updateEstateRatings(estateId: string): Promise<void> {
    const averageRating =
      await this.feedbackRepository.calculateAverageRating(estateId);
    await this.estateRepository.findOneAndUpdate(
      { _id: estateId },
      { ratings: averageRating },
    );
  }

  async getEstates(query: QueryDto) {
    const estates = await this.estateRepository.findPaginated({ query });
    return BaseResponse.success({
      businessCode: BusinessCode.OK,
      businessDescription: 'Estates Fetched Successfully',
      data: estates,
    });
  }

  async getMyEstates(query: QueryDto, userId: string) {
    const agent = await this.agentRepository.findOne({ user: userId });

    const estates = await this.estateRepository.findPaginated({
      query,
      filterQuery: { agent: agent._id },
    });
    return BaseResponse.success({
      businessCode: BusinessCode.OK,
      businessDescription: 'Estates Fetched Successfully',
      data: estates,
    });
  }

  async updateEstate(estateId: string, body: UpdateEstateDto, userId: string) {
    const agent = await this.agentRepository.findOne({
      user: userId,
    });

    await this.estateRepository.findOneAndUpdate(
      {
        agent: agent._id,
        _id: estateId,
      },
      { ...body },
    );
    return BaseResponse.success({
      businessCode: BusinessCode.OK,
      businessDescription: 'Estate Updated Successfully',
    });
  }

  async deleteEstate(estateId: string, userId: string) {
    const agent = await this.agentRepository.findOne({
      user: userId,
    });

    await this.estateRepository.softDelete({
      agent: agent._id,
      _id: estateId,
    });
    return BaseResponse.success({
      businessCode: BusinessCode.OK,
      businessDescription: 'Estate Deleted Successfully',
    });
  }

  async createFeedback(
    userId: string,
    estateId: string,
    body: CreateFeedbackDto,
  ) {
    const user = await this.userRepository.findOne({
      _id: userId,
    });

    const estate = await this.estateRepository.findById(estateId);

    await this.feedbackRepository.create({ user, estate, ...body });
    await this.updateEstateRatings(estateId);

    return BaseResponse.success({
      businessCode: BusinessCode.CREATED,
      businessDescription: 'Feedback Created Successfully',
    });
  }

  async getFeedback(feedbackId: string, estateId: string) {
    const feedback = await this.feedbackRepository.findOne({
      _id: feedbackId,
      estate: estateId,
    });
    return BaseResponse.success({
      businessCode: BusinessCode.OK,
      businessDescription: 'Feedback Fetched Successfully',
      data: feedback,
    });
  }

  async getFeedbacks(query: QueryDto, estateId: string) {
    const feedbacks = await this.feedbackRepository.findPaginated({
      query,
      filterQuery: { estate: estateId },
    });
    return BaseResponse.success({
      businessCode: BusinessCode.OK,
      businessDescription: 'Feedbacks Fetched Successfully',
      data: feedbacks,
    });
  }

  async updateFeedback(
    feedbackId: string,
    body: UpdateFeedbackDto,
    userId: string,
  ) {
    await this.feedbackRepository.findOneAndUpdate(
      {
        user: userId,
        _id: feedbackId,
      },
      { ...body },
    );
    return BaseResponse.success({
      businessCode: BusinessCode.OK,
      businessDescription: 'Feedback Updated Successfully',
    });
  }
}
