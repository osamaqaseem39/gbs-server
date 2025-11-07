import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { Publisher, PublisherDocument } from '../schemas/publisher.schema';

@Injectable()
export class PublisherRepository extends BaseRepository<PublisherDocument> {
  constructor(
    @InjectModel(Publisher.name) private readonly publisherModel: Model<PublisherDocument>,
  ) {
    super(publisherModel);
  }

  async findBySlug(slug: string): Promise<PublisherDocument | null> {
    return this.publisherModel.findOne({ slug }).exec();
  }

  async findActivePublishers(): Promise<PublisherDocument[]> {
    return this.publisherModel.find({ isActive: true }).sort({ name: 1 }).exec();
  }

  async findBySpecialty(specialty: string): Promise<PublisherDocument[]> {
    return this.publisherModel.find({ 
      specialties: specialty,
      isActive: true 
    }).sort({ name: 1 }).exec();
  }

  async searchPublishers(searchTerm: string): Promise<PublisherDocument[]> {
    return this.publisherModel.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { specialties: { $regex: searchTerm, $options: 'i' } },
      ],
      isActive: true,
    }).sort({ name: 1 }).exec();
  }

  async findTopPublishers(limit: number = 10): Promise<PublisherDocument[]> {
    return this.publisherModel.find({ 
      isActive: true,
      booksCount: { $gt: 0 }
    }).sort({ booksCount: -1 }).limit(limit).exec();
  }

  async incrementBooksCount(publisherId: string): Promise<PublisherDocument | null> {
    return this.publisherModel.findByIdAndUpdate(
      publisherId,
      { $inc: { booksCount: 1 } },
      { new: true }
    ).exec();
  }

  async decrementBooksCount(publisherId: string): Promise<PublisherDocument | null> {
    return this.publisherModel.findByIdAndUpdate(
      publisherId,
      { $inc: { booksCount: -1 } },
      { new: true }
    ).exec();
  }
}