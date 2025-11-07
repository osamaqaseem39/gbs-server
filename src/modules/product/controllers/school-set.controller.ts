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
import { SchoolSetService } from '../services/school-set.service';
import { CreateSchoolSetDto } from '../dto/create-school-set.dto';
import { UpdateSchoolSetDto } from '../dto/update-school-set.dto';

@ApiTags('School Sets')
@Controller('school-sets')
export class SchoolSetController {
  constructor(private readonly schoolSetService: SchoolSetService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new school set' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'School set created successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'School set with same slug already exists' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async create(@Body() createSchoolSetDto: CreateSchoolSetDto) {
    return await this.schoolSetService.createSchoolSet(createSchoolSetDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all school sets with optional filters' })
  @ApiQuery({ name: 'schoolName', required: false, description: 'Filter by school name' })
  @ApiQuery({ name: 'gradeLevel', required: false, description: 'Filter by grade level' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by set type' })
  @ApiQuery({ name: 'board', required: false, description: 'Filter by board/curriculum' })
  @ApiQuery({ name: 'academicYear', required: false, description: 'Filter by academic year' })
  @ApiQuery({ name: 'subject', required: false, description: 'Filter by subject' })
  @ApiQuery({ name: 'season', required: false, description: 'Filter by season' })
  @ApiQuery({ name: 'gender', required: false, description: 'Filter by gender' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by status' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
  @ApiQuery({ name: 'isFeatured', required: false, description: 'Filter by featured status' })
  @ApiQuery({ name: 'isBestseller', required: false, description: 'Filter by bestseller status' })
  @ApiQuery({ name: 'isNewArrival', required: false, description: 'Filter by new arrival status' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Filter by minimum price' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Filter by maximum price' })
  @ApiResponse({ status: HttpStatus.OK, description: 'School sets retrieved successfully' })
  async findAll(@Query() filters: any) {
    if (Object.keys(filters).length === 0) {
      return await this.schoolSetService.findAll();
    }
    return await this.schoolSetService.findByFilters(filters);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured school sets' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Featured school sets retrieved successfully' })
  async findFeatured() {
    return await this.schoolSetService.findFeaturedSets();
  }

  @Get('bestsellers')
  @ApiOperation({ summary: 'Get bestseller school sets' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Bestseller school sets retrieved successfully' })
  async findBestsellers() {
    return await this.schoolSetService.findBestsellerSets();
  }

  @Get('new-arrivals')
  @ApiOperation({ summary: 'Get new arrival school sets' })
  @ApiResponse({ status: HttpStatus.OK, description: 'New arrival school sets retrieved successfully' })
  async findNewArrivals() {
    return await this.schoolSetService.findNewArrivalSets();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active school sets' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Active school sets retrieved successfully' })
  async findActive() {
    return await this.schoolSetService.findActiveSets();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search school sets by text' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query text' })
  @ApiResponse({ status: HttpStatus.OK, description: 'School sets retrieved successfully' })
  async search(@Query('q') searchText: string) {
    return await this.schoolSetService.searchByText(searchText);
  }

  @Get('school/:schoolName')
  @ApiOperation({ summary: 'Get school sets by school name' })
  @ApiResponse({ status: HttpStatus.OK, description: 'School sets retrieved successfully' })
  async findBySchoolName(@Param('schoolName') schoolName: string) {
    return await this.schoolSetService.findBySchoolName(schoolName);
  }

  @Get('grade/:gradeLevel')
  @ApiOperation({ summary: 'Get school sets by grade level' })
  @ApiResponse({ status: HttpStatus.OK, description: 'School sets retrieved successfully' })
  async findByGradeLevel(@Param('gradeLevel') gradeLevel: string) {
    return await this.schoolSetService.findByGradeLevel(gradeLevel);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get school sets by type' })
  @ApiResponse({ status: HttpStatus.OK, description: 'School sets retrieved successfully' })
  async findByType(@Param('type') type: string) {
    return await this.schoolSetService.findByType(type);
  }

  @Get('board/:board')
  @ApiOperation({ summary: 'Get school sets by board' })
  @ApiResponse({ status: HttpStatus.OK, description: 'School sets retrieved successfully' })
  async findByBoard(@Param('board') board: string) {
    return await this.schoolSetService.findByBoard(board);
  }

  @Get('academic-year/:academicYear')
  @ApiOperation({ summary: 'Get school sets by academic year' })
  @ApiResponse({ status: HttpStatus.OK, description: 'School sets retrieved successfully' })
  async findByAcademicYear(@Param('academicYear') academicYear: string) {
    return await this.schoolSetService.findByAcademicYear(academicYear);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get school sets containing a specific product' })
  @ApiResponse({ status: HttpStatus.OK, description: 'School sets retrieved successfully' })
  async findByProductId(@Param('productId') productId: string) {
    return await this.schoolSetService.findByProductId(productId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get school set by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'School set retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'School set not found' })
  async findOne(@Param('id') id: string) {
    return await this.schoolSetService.findById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get school set by slug' })
  @ApiResponse({ status: HttpStatus.OK, description: 'School set retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'School set not found' })
  async findBySlug(@Param('slug') slug: string) {
    return await this.schoolSetService.findBySlug(slug);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update school set' })
  @ApiResponse({ status: HttpStatus.OK, description: 'School set updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'School set not found' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'School set with same slug already exists' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async update(@Param('id') id: string, @Body() updateSchoolSetDto: UpdateSchoolSetDto) {
    return await this.schoolSetService.updateSchoolSet(id, updateSchoolSetDto);
  }

  @Put(':id/toggle-active')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle school set active status' })
  @ApiResponse({ status: HttpStatus.OK, description: 'School set status toggled successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'School set not found' })
  async toggleActive(@Param('id') id: string) {
    return await this.schoolSetService.toggleActiveStatus(id);
  }

  @Put(':id/toggle-featured')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle school set featured status' })
  @ApiResponse({ status: HttpStatus.OK, description: 'School set featured status toggled successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'School set not found' })
  async toggleFeatured(@Param('id') id: string) {
    return await this.schoolSetService.toggleFeaturedStatus(id);
  }

  @Put(':id/toggle-bestseller')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle school set bestseller status' })
  @ApiResponse({ status: HttpStatus.OK, description: 'School set bestseller status toggled successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'School set not found' })
  async toggleBestseller(@Param('id') id: string) {
    return await this.schoolSetService.toggleBestsellerStatus(id);
  }

  @Put(':id/toggle-new-arrival')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle school set new arrival status' })
  @ApiResponse({ status: HttpStatus.OK, description: 'School set new arrival status toggled successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'School set not found' })
  async toggleNewArrival(@Param('id') id: string) {
    return await this.schoolSetService.toggleNewArrivalStatus(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete school set' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'School set deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'School set not found' })
  async remove(@Param('id') id: string) {
    return await this.schoolSetService.delete(id);
  }
}
