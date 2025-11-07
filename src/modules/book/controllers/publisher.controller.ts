import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublisherService } from '../services/publisher.service';
import { CreatePublisherDto } from '../dto/create-publisher.dto';
import { UpdatePublisherDto } from '../dto/update-publisher.dto';

@ApiTags('Publishers')
@Controller('publishers')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Post()
  create(@Body() dto: CreatePublisherDto) {
    return this.publisherService.create(dto);
  }

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.publisherService.findAll({ page: Number(page), limit: Number(limit) });
  }

  @Get('stats')
  getStats() {
    return this.publisherService.getPublisherStats();
  }

  @Get('active')
  findActive() {
    return this.publisherService.findActivePublishers();
  }

  @Get('top')
  findTop(@Query('limit') limit?: number) {
    return this.publisherService.findTopPublishers(Number(limit) || 10);
  }

  @Get('search')
  search(@Query('q') searchTerm: string) {
    return this.publisherService.searchPublishers(searchTerm);
  }

  @Get('specialty/:specialty')
  findBySpecialty(@Param('specialty') specialty: string) {
    return this.publisherService.findBySpecialty(specialty);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.publisherService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publisherService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePublisherDto) {
    return this.publisherService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publisherService.delete(id);
  }
}