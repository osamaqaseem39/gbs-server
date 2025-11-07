import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../admin/guards/jwt-auth.guard';
import { BookSpecificationService } from '../services/book-specification.service';
import { CreateBookSpecificationDto } from '../dto/create-book-specification.dto';
import { UpdateBookSpecificationDto } from '../dto/update-book-specification.dto';

@ApiTags('Book Specifications')
@Controller('book-specifications')
export class BookSpecificationController {
  constructor(private readonly bookSpecificationService: BookSpecificationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new book specification' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Book specification created successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Book specification with same product ID or ISBN already exists' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async create(@Body() createBookSpecificationDto: CreateBookSpecificationDto) {
    return await this.bookSpecificationService.createBookSpecification(createBookSpecificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all book specifications with optional filters' })
  @ApiQuery({ name: 'subject', required: false, description: 'Filter by subject' })
  @ApiQuery({ name: 'gradeLevel', required: false, description: 'Filter by grade level' })
  @ApiQuery({ name: 'board', required: false, description: 'Filter by board/curriculum' })
  @ApiQuery({ name: 'language', required: false, description: 'Filter by language' })
  @ApiQuery({ name: 'format', required: false, description: 'Filter by format' })
  @ApiQuery({ name: 'authorId', required: false, description: 'Filter by author ID' })
  @ApiQuery({ name: 'publisherId', required: false, description: 'Filter by publisher ID' })
  @ApiQuery({ name: 'bookSeriesId', required: false, description: 'Filter by book series ID' })
  @ApiQuery({ name: 'hasDigitalVersion', required: false, description: 'Filter by digital version availability' })
  @ApiQuery({ name: 'hasAudioVersion', required: false, description: 'Filter by audio version availability' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Book specifications retrieved successfully' })
  async findAll(@Query() filters: any) {
    if (Object.keys(filters).length === 0) {
      return await this.bookSpecificationService.findAll();
    }
    return await this.bookSpecificationService.findByFilters(filters);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search book specifications by text' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query text' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Book specifications retrieved successfully' })
  async search(@Query('q') searchText: string) {
    return await this.bookSpecificationService.searchByText(searchText);
  }

  @Get('subject/:subject')
  @ApiOperation({ summary: 'Get book specifications by subject' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Book specifications retrieved successfully' })
  async findBySubject(@Param('subject') subject: string) {
    return await this.bookSpecificationService.findBySubject(subject);
  }

  @Get('grade/:gradeLevel')
  @ApiOperation({ summary: 'Get book specifications by grade level' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Book specifications retrieved successfully' })
  async findByGradeLevel(@Param('gradeLevel') gradeLevel: string) {
    return await this.bookSpecificationService.findByGradeLevel(gradeLevel);
  }

  @Get('board/:board')
  @ApiOperation({ summary: 'Get book specifications by board' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Book specifications retrieved successfully' })
  async findByBoard(@Param('board') board: string) {
    return await this.bookSpecificationService.findByBoard(board);
  }

  @Get('language/:language')
  @ApiOperation({ summary: 'Get book specifications by language' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Book specifications retrieved successfully' })
  async findByLanguage(@Param('language') language: string) {
    return await this.bookSpecificationService.findByLanguage(language);
  }

  @Get('format/:format')
  @ApiOperation({ summary: 'Get book specifications by format' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Book specifications retrieved successfully' })
  async findByFormat(@Param('format') format: string) {
    return await this.bookSpecificationService.findByFormat(format);
  }

  @Get('author/:authorId')
  @ApiOperation({ summary: 'Get book specifications by author ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Book specifications retrieved successfully' })
  async findByAuthorId(@Param('authorId') authorId: string) {
    return await this.bookSpecificationService.findByAuthorId(authorId);
  }

  @Get('publisher/:publisherId')
  @ApiOperation({ summary: 'Get book specifications by publisher ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Book specifications retrieved successfully' })
  async findByPublisherId(@Param('publisherId') publisherId: string) {
    return await this.bookSpecificationService.findByPublisherId(publisherId);
  }

  @Get('series/:bookSeriesId')
  @ApiOperation({ summary: 'Get book specifications by book series ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Book specifications retrieved successfully' })
  async findByBookSeriesId(@Param('bookSeriesId') bookSeriesId: string) {
    return await this.bookSpecificationService.findByBookSeriesId(bookSeriesId);
  }

  @Get('isbn/:isbn')
  @ApiOperation({ summary: 'Get book specification by ISBN' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Book specification retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Book specification not found' })
  async findByIsbn(@Param('isbn') isbn: string) {
    return await this.bookSpecificationService.findByIsbn(isbn);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get book specification by product ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Book specification retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Book specification not found' })
  async findByProductId(@Param('productId') productId: string) {
    return await this.bookSpecificationService.findByProductId(productId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get book specification by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Book specification retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Book specification not found' })
  async findOne(@Param('id') id: string) {
    return await this.bookSpecificationService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update book specification' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Book specification updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Book specification not found' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Book specification with same product ID or ISBN already exists' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async update(@Param('id') id: string, @Body() updateBookSpecificationDto: UpdateBookSpecificationDto) {
    return await this.bookSpecificationService.updateBookSpecification(id, updateBookSpecificationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete book specification' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Book specification deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Book specification not found' })
  async remove(@Param('id') id: string) {
    return await this.bookSpecificationService.delete(id);
  }
}
