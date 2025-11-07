import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthorService } from '../services/author.service';
import { CreateAuthorDto } from '../dto/create-author.dto';
import { UpdateAuthorDto } from '../dto/update-author.dto';

@ApiTags('Authors')
@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  create(@Body() dto: CreateAuthorDto) {
    const authorData = {
      ...dto,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      dateOfDeath: dto.dateOfDeath ? new Date(dto.dateOfDeath) : undefined
    };
    return this.authorService.create(authorData);
  }

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.authorService.findAll({ page: Number(page), limit: Number(limit) });
  }

  @Get('stats')
  getStats() {
    return this.authorService.getAuthorStats();
  }

  @Get('active')
  findActive() {
    return this.authorService.findActiveAuthors();
  }

  @Get('top')
  findTop(@Query('limit') limit?: number) {
    return this.authorService.findTopAuthors(Number(limit) || 10);
  }

  @Get('search')
  search(@Query('q') searchTerm: string) {
    return this.authorService.searchAuthors(searchTerm);
  }

  @Get('genre/:genre')
  findByGenre(@Param('genre') genre: string) {
    return this.authorService.findByGenre(genre);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.authorService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAuthorDto) {
    const authorData = {
      ...dto,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      dateOfDeath: dto.dateOfDeath ? new Date(dto.dateOfDeath) : undefined
    };
    return this.authorService.update(id, authorData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorService.delete(id);
  }
}