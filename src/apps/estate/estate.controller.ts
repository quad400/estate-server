import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EstateService } from './estate.service';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { CreateEstateDto, UpdateEstateDto } from './dto/estate.dto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { QueryDto } from '../../common/query.dto';
import { CreateFeedbackDto, UpdateFeedbackDto } from './dto/feedback.dto';
import { Public } from '../../common/auth/jwt.strategy';

@Controller('estates')
export class EstateController {
  constructor(private readonly estateService: EstateService) {}

  @ApiOperation({ description: 'Create New Estate' })
  @Post()
  async createEstate(
    @Body() body: CreateEstateDto,
    @CurrentUser() userId: string,
  ) {
    return await this.estateService.createEstate(userId, body);
  }

  @Public()
  @ApiOperation({ description: 'Get Estate By Id' })
  @Get('/:estateId')
  async getEstate(@Param('estateId') estateId: string) {
    return await this.estateService.getEstate(estateId);
  }

  @Public()
  @ApiOperation({ description: 'Get Estates' })
  @ApiQuery({
    name: 'page',
    description: 'Page Number',
    required: false,
    schema: { default: 1 },
  })
  @ApiQuery({
    name: 'limit',
    description: 'Limit Number',
    required: false,
    schema: { default: 10 },
  })
  @ApiQuery({
    name: 'sortField',
    description: 'Field to sort',
    required: false,
  })
  @ApiQuery({
    name: 'sortDirection',
    description: 'Direction To Sort ASC | DESC',
    required: false,
  })
  @ApiQuery({
    name: 'searchField',
    description: 'Field Of Estate to search',
    required: false,
  })
  @ApiQuery({
    name: 'searchValue',
    description: 'Search Input',
    required: false,
  })
  @Get()
  async getEstates(@Query() query: QueryDto) {
    return await this.estateService.getEstates(query);
  }

  @ApiOperation({ description: 'Get My Estates' })
  @ApiQuery({
    name: 'page',
    description: 'Page Number',
    required: false,
    schema: { default: 1 },
  })
  @ApiQuery({
    name: 'limit',
    description: 'Limit Number',
    required: false,
    schema: { default: 10 },
  })
  @ApiQuery({
    name: 'sortField',
    description: 'Field to sort',
    required: false,
  })
  @ApiQuery({
    name: 'sortDirection',
    description: 'Direction To Sort ASC | DESC',
    required: false,
  })
  @ApiQuery({
    name: 'searchField',
    description: 'Field Of Estate to search',
    required: false,
  })
  @ApiQuery({
    name: 'searchValue',
    description: 'Search Input',
    required: false,
  })
  @Get("/user/my-estates")
  async getMyEstates(@Query() query: QueryDto, @CurrentUser() userId: string) {
    return await this.estateService.getMyEstates(query, userId);
  }

  @ApiOperation({ description: 'Delete Estate' })
  @Delete('/:estateId')
  async deleteEstate(
    @Param('estateId') estateId: string,
    @CurrentUser() userId: string,
  ) {
    return await this.estateService.deleteEstate(estateId, userId);
  }

  @ApiOperation({ description: 'Update Estate' })
  @Patch('/:estateId')
  async updateEstate(
    @Param('estateId') estateId: string,
    @Body() body: UpdateEstateDto,
    @CurrentUser() userId: string,
  ) {
    return await this.estateService.updateEstate(estateId, body, userId);
  }

  @ApiOperation({ description: 'Create New Feedback' })
  @Post('/:estateId/feedbacks')
  async createFeedback(
    @Body() body: CreateFeedbackDto,
    @Param('estateId') estateId: string,
    @CurrentUser() userId: string,
  ) {
    return await this.estateService.createFeedback(userId, estateId, body);
  }

  @ApiOperation({ description: 'Get Feedback By Id' })
  @Get('/:estateId/feedbacks/:feedbackId')
  async getFeedback(@Param('feedbackId') feedbackId: string, @Param('estateId') estateId: string) {
    return await this.estateService.getFeedback(feedbackId, estateId);
  }

  @Public()
  @ApiOperation({ description: 'Get Feedbacks' })
  @ApiQuery({
    name: 'page',
    description: 'Page Number',
    required: false,
    schema: { default: 1 },
  })
  @ApiQuery({
    name: 'limit',
    description: 'Limit Number',
    required: false,
    schema: { default: 10 },
  })
  @ApiQuery({
    name: 'sortField',
    description: 'Field to sort',
    required: false,
  })
  @ApiQuery({
    name: 'sortDirection',
    description: 'Direction To Sort ASC | DESC',
    required: false,
  })
  @ApiQuery({
    name: 'searchField',
    description: 'Field Of Feedback to search',
    required: false,
  })
  @ApiQuery({
    name: 'searchValue',
    description: 'Search Input',
    required: false,
  })
  @Get('/:estateId/feedbacks')
  async getFeeedbacks(@Query() query: QueryDto, @Param("estateId") estateId: string) {
    return await this.estateService.getFeedbacks(query, estateId);
  }

  @ApiOperation({ description: 'Update Feedback' })
  @Patch('/:estateId/feedbacks/:feedbackId')
  async updateFeedback(
    @Param('feedbackId') feedbackId: string,
    @Body() body: UpdateFeedbackDto,
    @CurrentUser() userId: string,
  ) {
    return await this.estateService.updateFeedback(feedbackId, body, userId);
  }
}
