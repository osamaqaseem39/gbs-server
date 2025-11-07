import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { BookSeries, BookSeriesDocument } from '../schemas/book-series.schema';

@Injectable()
export class BookSeriesRepository extends BaseRepository<BookSeriesDocument> {
  constructor(
    @InjectModel(BookSeries.name) private readonly bookSeriesModel: Model<BookSeriesDocument>,
  ) {
    super(bookSeriesModel);
  }

  async findBySlug(slug: string): Promise<BookSeriesDocument | null> {
    return this.bookSeriesModel.findOne({ slug }).exec();
  }

  async findActiveSeries(): Promise<BookSeriesDocument[]> {
    return this.bookSeriesModel.find({ isActive: true }).sort({ name: 1 }).exec();
  }

  async findByAuthorId(authorId: string): Promise<BookSeriesDocument[]> {
    return this.bookSeriesModel.find({ 
      authorId,
      isActive: true 
    }).sort({ name: 1 }).exec();
  }

  async findByPublisherId(publisherId: string): Promise<BookSeriesDocument[]> {
    return this.bookSeriesModel.find({ 
      publisherId,
      isActive: true 
    }).sort({ name: 1 }).exec();
  }

  async findByGenre(genre: string): Promise<BookSeriesDocument[]> {
    return this.bookSeriesModel.find({ 
      genre,
      isActive: true 
    }).sort({ name: 1 }).exec();
  }

  async findByAgeGroup(ageGroup: string): Promise<BookSeriesDocument[]> {
    return this.bookSeriesModel.find({ 
      ageGroup,
      isActive: true 
    }).sort({ name: 1 }).exec();
  }

  async findOngoingSeries(): Promise<BookSeriesDocument[]> {
    return this.bookSeriesModel.find({ 
      isOngoing: true,
      isActive: true 
    }).sort({ name: 1 }).exec();
  }

  async searchSeries(searchTerm: string): Promise<BookSeriesDocument[]> {
    return this.bookSeriesModel.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { genre: { $regex: searchTerm, $options: 'i' } },
      ],
      isActive: true,
    }).sort({ name: 1 }).exec();
  }

  async findTopSeries(limit: number = 10): Promise<BookSeriesDocument[]> {
    return this.bookSeriesModel.find({ 
      isActive: true,
      totalBooks: { $gt: 0 }
    }).sort({ totalBooks: -1 }).limit(limit).exec();
  }

  async addBookToSeries(seriesId: string, bookId: string, order: number, title: string): Promise<BookSeriesDocument | null> {
    return this.bookSeriesModel.findByIdAndUpdate(
      seriesId,
      { 
        $push: { 
          bookIds: bookId,
          seriesOrder: { bookId, order, title }
        },
        $inc: { totalBooks: 1 }
      },
      { new: true }
    ).exec();
  }

  async removeBookFromSeries(seriesId: string, bookId: string): Promise<BookSeriesDocument | null> {
    return this.bookSeriesModel.findByIdAndUpdate(
      seriesId,
      { 
        $pull: { 
          bookIds: bookId,
          seriesOrder: { bookId }
        },
        $inc: { totalBooks: -1 }
      },
      { new: true }
    ).exec();
  }
}