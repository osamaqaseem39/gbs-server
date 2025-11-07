import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorController } from './controllers/author.controller';
import { PublisherController } from './controllers/publisher.controller';
import { BookSeriesController } from './controllers/book-series.controller';
import { AuthorService } from './services/author.service';
import { PublisherService } from './services/publisher.service';
import { BookSeriesService } from './services/book-series.service';
import { AuthorRepository } from './repositories/author.repository';
import { PublisherRepository } from './repositories/publisher.repository';
import { BookSeriesRepository } from './repositories/book-series.repository';
import { Author, AuthorSchema } from './schemas/author.schema';
import { Publisher, PublisherSchema } from './schemas/publisher.schema';
import { BookSeries, BookSeriesSchema } from './schemas/book-series.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Author.name, schema: AuthorSchema },
      { name: Publisher.name, schema: PublisherSchema },
      { name: BookSeries.name, schema: BookSeriesSchema },
    ]),
  ],
  controllers: [AuthorController, PublisherController, BookSeriesController],
  providers: [
    AuthorService,
    PublisherService,
    BookSeriesService,
    AuthorRepository,
    PublisherRepository,
    BookSeriesRepository,
  ],
  exports: [
    AuthorService,
    PublisherService,
    BookSeriesService,
    AuthorRepository,
    PublisherRepository,
    BookSeriesRepository,
  ],
})
export class BookModule {}