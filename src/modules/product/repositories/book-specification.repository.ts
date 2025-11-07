import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { BookSpecification, BookSpecificationDocument } from '../schemas/book-specification.schema';

@Injectable()
export class BookSpecificationRepository extends BaseRepository<BookSpecificationDocument> {
  constructor(
    @InjectModel(BookSpecification.name) private readonly bookSpecificationModel: Model<BookSpecificationDocument>,
  ) {
    super(bookSpecificationModel);
  }

  async findByProductId(productId: string): Promise<BookSpecificationDocument | null> {
    return this.bookSpecificationModel.findOne({ productId }).exec();
  }

  async findByIsbn(isbn: string): Promise<BookSpecificationDocument | null> {
    return this.bookSpecificationModel.findOne({ 
      $or: [{ isbn }, { isbn13: isbn }, { isbn10: isbn }] 
    }).exec();
  }

  async findBySubject(subject: string): Promise<BookSpecificationDocument[]> {
    return this.bookSpecificationModel.find({ subject }).exec();
  }

  async findByGradeLevel(gradeLevel: string): Promise<BookSpecificationDocument[]> {
    return this.bookSpecificationModel.find({ gradeLevel }).exec();
  }

  async findByBoard(board: string): Promise<BookSpecificationDocument[]> {
    return this.bookSpecificationModel.find({ board }).exec();
  }

  async findByLanguage(language: string): Promise<BookSpecificationDocument[]> {
    return this.bookSpecificationModel.find({ language }).exec();
  }

  async findByFormat(format: string): Promise<BookSpecificationDocument[]> {
    return this.bookSpecificationModel.find({ format }).exec();
  }

  async findByAuthorId(authorId: string): Promise<BookSpecificationDocument[]> {
    return this.bookSpecificationModel.find({ authorId }).exec();
  }

  async findByPublisherId(publisherId: string): Promise<BookSpecificationDocument[]> {
    return this.bookSpecificationModel.find({ publisherId }).exec();
  }

  async findByBookSeriesId(bookSeriesId: string): Promise<BookSpecificationDocument[]> {
    return this.bookSpecificationModel.find({ bookSeriesId }).exec();
  }

  async findByFilters(filters: {
    subject?: string;
    gradeLevel?: string;
    board?: string;
    language?: string;
    format?: string;
    authorId?: string;
    publisherId?: string;
    bookSeriesId?: string;
    hasDigitalVersion?: boolean;
    hasAudioVersion?: boolean;
  }): Promise<BookSpecificationDocument[]> {
    const query: any = {};
    
    if (filters.subject) {
      query.subject = filters.subject;
    }
    if (filters.gradeLevel) {
      query.gradeLevel = filters.gradeLevel;
    }
    if (filters.board) {
      query.board = new RegExp(filters.board, 'i');
    }
    if (filters.language) {
      query.language = filters.language;
    }
    if (filters.format) {
      query.format = filters.format;
    }
    if (filters.authorId) {
      query.authorId = filters.authorId;
    }
    if (filters.publisherId) {
      query.publisherId = filters.publisherId;
    }
    if (filters.bookSeriesId) {
      query.bookSeriesId = filters.bookSeriesId;
    }
    if (filters.hasDigitalVersion !== undefined) {
      query.hasDigitalVersion = filters.hasDigitalVersion;
    }
    if (filters.hasAudioVersion !== undefined) {
      query.hasAudioVersion = filters.hasAudioVersion;
    }

    return this.bookSpecificationModel.find(query).exec();
  }

  async searchByText(searchText: string): Promise<BookSpecificationDocument[]> {
    return this.bookSpecificationModel.find({
      $or: [
        { authors: { $in: [new RegExp(searchText, 'i')] } },
        { editors: { $in: [new RegExp(searchText, 'i')] } },
        { illustrators: { $in: [new RegExp(searchText, 'i')] } },
        { publisher: new RegExp(searchText, 'i') },
        { seriesName: new RegExp(searchText, 'i') },
        { summary: new RegExp(searchText, 'i') },
      ]
    }).exec();
  }
}
