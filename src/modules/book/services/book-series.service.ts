import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../../common/services/base.service';
import { BookSeries } from '../schemas/book-series.schema';
import { BookSeriesRepository } from '../repositories/book-series.repository';

@Injectable()
export class BookSeriesService extends BaseService<BookSeries> {
  constructor(private readonly bookSeriesRepository: BookSeriesRepository) {
    super(bookSeriesRepository);
  }

  async findBySlug(slug: string): Promise<BookSeries> {
    const series = await this.bookSeriesRepository.findBySlug(slug);
    if (!series) {
      throw new NotFoundException('Book series not found');
    }
    return series;
  }

  async findActiveSeries(): Promise<BookSeries[]> {
    return this.bookSeriesRepository.findActiveSeries();
  }

  async findByAuthorId(authorId: string): Promise<BookSeries[]> {
    return this.bookSeriesRepository.findByAuthorId(authorId);
  }

  async findByPublisherId(publisherId: string): Promise<BookSeries[]> {
    return this.bookSeriesRepository.findByPublisherId(publisherId);
  }

  async findByGenre(genre: string): Promise<BookSeries[]> {
    return this.bookSeriesRepository.findByGenre(genre);
  }

  async findByAgeGroup(ageGroup: string): Promise<BookSeries[]> {
    return this.bookSeriesRepository.findByAgeGroup(ageGroup);
  }

  async findOngoingSeries(): Promise<BookSeries[]> {
    return this.bookSeriesRepository.findOngoingSeries();
  }

  async searchSeries(searchTerm: string): Promise<BookSeries[]> {
    return this.bookSeriesRepository.searchSeries(searchTerm);
  }

  async findTopSeries(limit: number = 10): Promise<BookSeries[]> {
    return this.bookSeriesRepository.findTopSeries(limit);
  }

  async addBookToSeries(seriesId: string, bookId: string, order: number, title: string): Promise<BookSeries> {
    const series = await this.bookSeriesRepository.addBookToSeries(seriesId, bookId, order, title);
    if (!series) {
      throw new NotFoundException('Book series not found');
    }
    return series;
  }

  async removeBookFromSeries(seriesId: string, bookId: string): Promise<BookSeries> {
    const series = await this.bookSeriesRepository.removeBookFromSeries(seriesId, bookId);
    if (!series) {
      throw new NotFoundException('Book series not found');
    }
    return series;
  }

  async getSeriesStats(): Promise<any> {
    const totalSeries = await this.bookSeriesRepository.findAll();
    const activeSeries = await this.findActiveSeries();
    const ongoingSeries = await this.findOngoingSeries();
    const topSeries = await this.findTopSeries(5);
    
    const totalBooks = activeSeries.reduce((sum, series) => sum + series.totalBooks, 0);
    const averageBooksPerSeries = activeSeries.length > 0 ? totalBooks / activeSeries.length : 0;

    return {
      totalSeries: totalSeries.data.length,
      activeSeries: activeSeries.length,
      ongoingSeries: ongoingSeries.length,
      totalBooks,
      averageBooksPerSeries: Math.round(averageBooksPerSeries * 100) / 100,
      topSeries: topSeries.map(series => ({
        id: series._id,
        name: series.name,
        totalBooks: series.totalBooks,
      })),
    };
  }
}