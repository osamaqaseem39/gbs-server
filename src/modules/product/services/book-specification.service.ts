import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../../common/services/base.service';
import { BookSpecificationRepository } from '../repositories/book-specification.repository';
import { BookSpecificationDocument } from '../schemas/book-specification.schema';
import { CreateBookSpecificationDto } from '../dto/create-book-specification.dto';
import { UpdateBookSpecificationDto } from '../dto/update-book-specification.dto';

@Injectable()
export class BookSpecificationService extends BaseService<BookSpecificationDocument> {
  constructor(
    private readonly bookSpecificationRepository: BookSpecificationRepository,
  ) {
    super(bookSpecificationRepository);
  }

  async createBookSpecification(createBookSpecificationDto: CreateBookSpecificationDto): Promise<BookSpecificationDocument> {
    // Check if book specification with same product ID already exists
    const existingProduct = await this.bookSpecificationRepository.findByProductId(createBookSpecificationDto.productId);
    if (existingProduct) {
      throw new ConflictException(`Book specification for product ID '${createBookSpecificationDto.productId}' already exists`);
    }

    // Check if ISBN already exists
    if (createBookSpecificationDto.isbn) {
      const existingIsbn = await this.bookSpecificationRepository.findByIsbn(createBookSpecificationDto.isbn);
      if (existingIsbn) {
        throw new ConflictException(`Book specification with ISBN '${createBookSpecificationDto.isbn}' already exists`);
      }
    }

    // Check if ISBN-13 already exists
    if (createBookSpecificationDto.isbn13) {
      const existingIsbn13 = await this.bookSpecificationRepository.findByIsbn(createBookSpecificationDto.isbn13);
      if (existingIsbn13) {
        throw new ConflictException(`Book specification with ISBN-13 '${createBookSpecificationDto.isbn13}' already exists`);
      }
    }

    // Check if ISBN-10 already exists
    if (createBookSpecificationDto.isbn10) {
      const existingIsbn10 = await this.bookSpecificationRepository.findByIsbn(createBookSpecificationDto.isbn10);
      if (existingIsbn10) {
        throw new ConflictException(`Book specification with ISBN-10 '${createBookSpecificationDto.isbn10}' already exists`);
      }
    }

    const bookSpecData = {
      ...createBookSpecificationDto,
      publicationDate: createBookSpecificationDto.publicationDate ? new Date(createBookSpecificationDto.publicationDate) : undefined
    };
    return await this.bookSpecificationRepository.create(bookSpecData);
  }

  async updateBookSpecification(id: string, updateBookSpecificationDto: UpdateBookSpecificationDto): Promise<BookSpecificationDocument> {
    const existingBookSpec = await this.bookSpecificationRepository.findById(id);
    if (!existingBookSpec) {
      throw new NotFoundException(`Book specification with ID '${id}' not found`);
    }

    // Check if product ID is being updated and if it already exists
    if (updateBookSpecificationDto.productId && updateBookSpecificationDto.productId !== existingBookSpec.productId) {
      const existingProduct = await this.bookSpecificationRepository.findByProductId(updateBookSpecificationDto.productId);
      if (existingProduct) {
        throw new ConflictException(`Book specification for product ID '${updateBookSpecificationDto.productId}' already exists`);
      }
    }

    // Check if ISBN is being updated and if it already exists
    if (updateBookSpecificationDto.isbn && updateBookSpecificationDto.isbn !== existingBookSpec.isbn) {
      const existingIsbn = await this.bookSpecificationRepository.findByIsbn(updateBookSpecificationDto.isbn);
      if (existingIsbn) {
        throw new ConflictException(`Book specification with ISBN '${updateBookSpecificationDto.isbn}' already exists`);
      }
    }

    // Check if ISBN-13 is being updated and if it already exists
    if (updateBookSpecificationDto.isbn13 && updateBookSpecificationDto.isbn13 !== existingBookSpec.isbn13) {
      const existingIsbn13 = await this.bookSpecificationRepository.findByIsbn(updateBookSpecificationDto.isbn13);
      if (existingIsbn13) {
        throw new ConflictException(`Book specification with ISBN-13 '${updateBookSpecificationDto.isbn13}' already exists`);
      }
    }

    // Check if ISBN-10 is being updated and if it already exists
    if (updateBookSpecificationDto.isbn10 && updateBookSpecificationDto.isbn10 !== existingBookSpec.isbn10) {
      const existingIsbn10 = await this.bookSpecificationRepository.findByIsbn(updateBookSpecificationDto.isbn10);
      if (existingIsbn10) {
        throw new ConflictException(`Book specification with ISBN-10 '${updateBookSpecificationDto.isbn10}' already exists`);
      }
    }

    const bookSpecData = {
      ...updateBookSpecificationDto,
      publicationDate: updateBookSpecificationDto.publicationDate ? new Date(updateBookSpecificationDto.publicationDate) : undefined
    };
    return await this.bookSpecificationRepository.update(id, bookSpecData);
  }

  async findByProductId(productId: string): Promise<BookSpecificationDocument> {
    const bookSpec = await this.bookSpecificationRepository.findByProductId(productId);
    if (!bookSpec) {
      throw new NotFoundException(`Book specification for product ID '${productId}' not found`);
    }
    return bookSpec;
  }

  async findByIsbn(isbn: string): Promise<BookSpecificationDocument> {
    const bookSpec = await this.bookSpecificationRepository.findByIsbn(isbn);
    if (!bookSpec) {
      throw new NotFoundException(`Book specification with ISBN '${isbn}' not found`);
    }
    return bookSpec;
  }

  async findBySubject(subject: string): Promise<BookSpecificationDocument[]> {
    return await this.bookSpecificationRepository.findBySubject(subject);
  }

  async findByGradeLevel(gradeLevel: string): Promise<BookSpecificationDocument[]> {
    return await this.bookSpecificationRepository.findByGradeLevel(gradeLevel);
  }

  async findByBoard(board: string): Promise<BookSpecificationDocument[]> {
    return await this.bookSpecificationRepository.findByBoard(board);
  }

  async findByLanguage(language: string): Promise<BookSpecificationDocument[]> {
    return await this.bookSpecificationRepository.findByLanguage(language);
  }

  async findByFormat(format: string): Promise<BookSpecificationDocument[]> {
    return await this.bookSpecificationRepository.findByFormat(format);
  }

  async findByAuthorId(authorId: string): Promise<BookSpecificationDocument[]> {
    return await this.bookSpecificationRepository.findByAuthorId(authorId);
  }

  async findByPublisherId(publisherId: string): Promise<BookSpecificationDocument[]> {
    return await this.bookSpecificationRepository.findByPublisherId(publisherId);
  }

  async findByBookSeriesId(bookSeriesId: string): Promise<BookSpecificationDocument[]> {
    return await this.bookSpecificationRepository.findByBookSeriesId(bookSeriesId);
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
    return await this.bookSpecificationRepository.findByFilters(filters);
  }

  async searchByText(searchText: string): Promise<BookSpecificationDocument[]> {
    return await this.bookSpecificationRepository.searchByText(searchText);
  }
}
