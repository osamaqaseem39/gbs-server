import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../../common/services/base.service';
import { Author } from '../schemas/author.schema';
import { AuthorRepository } from '../repositories/author.repository';

@Injectable()
export class AuthorService extends BaseService<Author> {
  constructor(private readonly authorRepository: AuthorRepository) {
    super(authorRepository);
  }

  async findBySlug(slug: string): Promise<Author> {
    const author = await this.authorRepository.findBySlug(slug);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return author;
  }

  async findActiveAuthors(): Promise<Author[]> {
    return this.authorRepository.findActiveAuthors();
  }

  async findByGenre(genre: string): Promise<Author[]> {
    return this.authorRepository.findByGenre(genre);
  }

  async searchAuthors(searchTerm: string): Promise<Author[]> {
    return this.authorRepository.searchAuthors(searchTerm);
  }

  async findTopAuthors(limit: number = 10): Promise<Author[]> {
    return this.authorRepository.findTopAuthors(limit);
  }

  async incrementBooksCount(authorId: string): Promise<Author> {
    const author = await this.authorRepository.incrementBooksCount(authorId);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return author;
  }

  async decrementBooksCount(authorId: string): Promise<Author> {
    const author = await this.authorRepository.decrementBooksCount(authorId);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return author;
  }

  async getAuthorStats(): Promise<any> {
    const totalAuthors = await this.authorRepository.findAll();
    const activeAuthors = await this.findActiveAuthors();
    const topAuthors = await this.findTopAuthors(5);
    
    const totalBooks = activeAuthors.reduce((sum, author) => sum + author.booksCount, 0);
    const averageBooksPerAuthor = activeAuthors.length > 0 ? totalBooks / activeAuthors.length : 0;

    return {
      totalAuthors: totalAuthors.data.length,
      activeAuthors: activeAuthors.length,
      totalBooks,
      averageBooksPerAuthor: Math.round(averageBooksPerAuthor * 100) / 100,
      topAuthors: topAuthors.map(author => ({
        id: author._id,
        name: author.name,
        booksCount: author.booksCount,
      })),
    };
  }
}