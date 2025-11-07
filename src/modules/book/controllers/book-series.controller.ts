import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookSeriesService } from '../services/book-series.service';
import { CreateBookSeriesDto } from '../dto/create-book-series.dto';
import { UpdateBookSeriesDto } from '../dto/update-book-series.dto';

@ApiTags('Book Series')
@Controller('book-series')
export class BookSeriesController {
  constructor(private readonly bookSeriesService: BookSeriesService) {}

  @Post()
  create(@Body() dto: CreateBookSeriesDto) {
    return this.bookSeriesService.create(dto);
  }

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.bookSeriesService.findAll({ page: Number(page), limit: Number(limit) });
  }

  @Get('stats')
  getStats() {
    return this.bookSeriesService.getSeriesStats();
  }

  @Get('active')
  findActive() {
    return this.bookSeriesService.findActiveSeries();
  }

  @Get('ongoing')
  findOngoing() {
    return this.bookSeriesService.findOngoingSeries();
  }

  @Get('top')
  findTop(@Query('limit') limit?: number) {
    return this.bookSeriesService.findTopSeries(Number(limit) || 10);
  }

  @Get('search')
  search(@Query('q') searchTerm: string) {
    return this.bookSeriesService.searchSeries(searchTerm);
  }

  @Get('author/:authorId')
  findByAuthor(@Param('authorId') authorId: string) {
    return this.bookSeriesService.findByAuthorId(authorId);
  }

  @Get('publisher/:publisherId')
  findByPublisher(@Param('publisherId') publisherId: string) {
    return this.bookSeriesService.findByPublisherId(publisherId);
  }

  @Get('genre/:genre')
  findByGenre(@Param('genre') genre: string) {
    return this.bookSeriesService.findByGenre(genre);
  }

  @Get('age-group/:ageGroup')
  findByAgeGroup(@Param('ageGroup') ageGroup: string) {
    return this.bookSeriesService.findByAgeGroup(ageGroup);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.bookSeriesService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookSeriesService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookSeriesDto) {
    return this.bookSeriesService.update(id, dto);
  }

  @Put(':id/add-book')
  addBook(@Param('id') id: string, @Body() body: { bookId: string; order: number; title: string }) {
    return this.bookSeriesService.addBookToSeries(id, body.bookId, body.order, body.title);
  }

  @Put(':id/remove-book')
  removeBook(@Param('id') id: string, @Body() body: { bookId: string }) {
    return this.bookSeriesService.removeBookFromSeries(id, body.bookId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookSeriesService.delete(id);
  }
}