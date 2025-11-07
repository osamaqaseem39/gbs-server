import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../../common/services/base.service';
import { Publisher } from '../schemas/publisher.schema';
import { PublisherRepository } from '../repositories/publisher.repository';

@Injectable()
export class PublisherService extends BaseService<Publisher> {
  constructor(private readonly publisherRepository: PublisherRepository) {
    super(publisherRepository);
  }

  async findBySlug(slug: string): Promise<Publisher> {
    const publisher = await this.publisherRepository.findBySlug(slug);
    if (!publisher) {
      throw new NotFoundException('Publisher not found');
    }
    return publisher;
  }

  async findActivePublishers(): Promise<Publisher[]> {
    return this.publisherRepository.findActivePublishers();
  }

  async findBySpecialty(specialty: string): Promise<Publisher[]> {
    return this.publisherRepository.findBySpecialty(specialty);
  }

  async searchPublishers(searchTerm: string): Promise<Publisher[]> {
    return this.publisherRepository.searchPublishers(searchTerm);
  }

  async findTopPublishers(limit: number = 10): Promise<Publisher[]> {
    return this.publisherRepository.findTopPublishers(limit);
  }

  async incrementBooksCount(publisherId: string): Promise<Publisher> {
    const publisher = await this.publisherRepository.incrementBooksCount(publisherId);
    if (!publisher) {
      throw new NotFoundException('Publisher not found');
    }
    return publisher;
  }

  async decrementBooksCount(publisherId: string): Promise<Publisher> {
    const publisher = await this.publisherRepository.decrementBooksCount(publisherId);
    if (!publisher) {
      throw new NotFoundException('Publisher not found');
    }
    return publisher;
  }

  async getPublisherStats(): Promise<any> {
    const totalPublishers = await this.publisherRepository.findAll();
    const activePublishers = await this.findActivePublishers();
    const topPublishers = await this.findTopPublishers(5);
    
    const totalBooks = activePublishers.reduce((sum, publisher) => sum + publisher.booksCount, 0);
    const averageBooksPerPublisher = activePublishers.length > 0 ? totalBooks / activePublishers.length : 0;

    return {
      totalPublishers: totalPublishers.data.length,
      activePublishers: activePublishers.length,
      totalBooks,
      averageBooksPerPublisher: Math.round(averageBooksPerPublisher * 100) / 100,
      topPublishers: topPublishers.map(publisher => ({
        id: publisher._id,
        name: publisher.name,
        booksCount: publisher.booksCount,
      })),
    };
  }
}