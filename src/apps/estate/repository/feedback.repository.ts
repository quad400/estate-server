import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, Connection, FilterQuery } from 'mongoose';
import { AbstractRepository } from '../../../common/db/abstract.repository';
import { Feedback } from '../model/feedback.model';
import { QueryDto } from '../../../common/query.dto';

@Injectable()
export class FeedbackRepository extends AbstractRepository<Feedback> {
  protected readonly logger = new Logger(FeedbackRepository.name);

  constructor(
    @InjectModel(Feedback.name) feedbackModel: Model<Feedback>,
    @InjectConnection() connection: Connection,
  ) {
    super(feedbackModel, connection);
  }
  async findOne(
    filterQuery: FilterQuery<Feedback>,
    disableCheck = false,
  ): Promise<Feedback> {
    const document = await this.model
      .findOne(filterQuery, {
        is_deleted: false,
      })
      .populate({
        path: 'user',
        select: "_id email is_deleted name createdAt updatedAt"
      });

    if (!document && !disableCheck) {
      throw new NotFoundException(
        `${this.model.collection.collectionName
          .toUpperCase()
          .slice(0, -1)} not found.`,
      );
    }

    return document;
  }
  async findPaginated({
    query,
    filterQuery,
  }: {
    query: QueryDto;
    filterQuery?: FilterQuery<Feedback>;
  }): Promise<any> {
    const { limit, page, searchField, searchValue, sortDirection, sortField } =
      query;
    const skip = (page - 1) * limit;

    const filter = { is_deleted: false };

    // Construct the sorting object
    const sortFilter: Record<string, 1 | -1> = sortField
      ? { [sortField]: sortDirection === 'DESC' ? -1 : 1 }
      : { created_at: 1 };

    // If a search query is provided, apply text search or regex search
    if (searchField && searchValue) {
      filter[searchField] = { $regex: searchValue, $options: 'i' }; // Case-insensitive regex search
    }

    // Find the documents with pagination, filtering, and sorting
    const items = await this.model
      .find({ ...filter, ...filterQuery })
      .populate({
        path: 'user',
        select: "_id email is_deleted name createdAt updatedAt"
      })
      .sort(sortFilter)
      .skip(skip)
      .limit(limit)
      .exec();

    // Count the total number of documents for pagination metadata
    const totalItems = await this.model
      .countDocuments({ ...filter, ...filterQuery })
      .exec();

    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      totalItems,
      totalPages,
      currentPage: page,
      hasPreviousPage,
      hasNextPage,
      items,
    };
  }

  async calculateAverageRating(estateId: string): Promise<number> {
    const feedbacks = await this.model.aggregate([
      { $match: { estate: estateId } },
      { $group: { _id: '$estate', averageRating: { $avg: '$rate' } } },
    ]);

    // Return the average rating, or 0 if no feedback exists
    return feedbacks.length > 0 ? feedbacks[0].averageRating : 0;
  }
}
