import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { Author, AuthorDocument } from '../schemas/author.schema';

@Injectable()
export class AuthorRepository extends BaseRepository<AuthorDocument> {
  constructor(
    @InjectModel(Author.name) private readonly authorModel: Model<AuthorDocument>,
  ) {
    super(authorModel);
  }

  async findBySlug(slug: string): Promise<AuthorDocument | null> {
    return this.authorModel.findOne({ slug }).exec();
  }

  async findActiveAuthors(): Promise<AuthorDocument[]> {
    return this.authorModel.find({ isActive: true }).sort({ name: 1 }).exec();
  }

  async findByGenre(genre: string): Promise<AuthorDocument[]> {
    return this.authorModel.find({ 
      genres: genre,
      isActive: true 
    }).sort({ name: 1 }).exec();
  }

  async searchAuthors(searchTerm: string): Promise<AuthorDocument[]> {
    return this.authorModel.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { biography: { $regex: searchTerm, $options: 'i' } },
        { nationality: { $regex: searchTerm, $options: 'i' } },
      ],
      isActive: true,
    }).sort({ name: 1 }).exec();
  }

  async findTopAuthors(limit: number = 10): Promise<AuthorDocument[]> {
    return this.authorModel.find({ 
      isActive: true,
      booksCount: { $gt: 0 }
    }).sort({ booksCount: -1 }).limit(limit).exec();
  }

  async incrementBooksCount(authorId: string): Promise<AuthorDocument | null> {
    return this.authorModel.findByIdAndUpdate(
      authorId,
      { $inc: { booksCount: 1 } },
      { new: true }
    ).exec();
  }

  async decrementBooksCount(authorId: string): Promise<AuthorDocument | null> {
    return this.authorModel.findByIdAndUpdate(
      authorId,
      { $inc: { booksCount: -1 } },
      { new: true }
    ).exec();
  }
}