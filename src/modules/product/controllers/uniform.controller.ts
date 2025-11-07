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
import { UniformService } from '../services/uniform.service';
import { CreateUniformDto } from '../dto/create-uniform.dto';
import { UpdateUniformDto } from '../dto/update-uniform.dto';

@ApiTags('Uniforms')
@Controller('uniforms')
export class UniformController {
  constructor(private readonly uniformService: UniformService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new uniform' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Uniform created successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Uniform with same slug or product ID already exists' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async create(@Body() createUniformDto: CreateUniformDto) {
    return await this.uniformService.createUniform(createUniformDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all uniforms with optional filters' })
  @ApiQuery({ name: 'schoolName', required: false, description: 'Filter by school name' })
  @ApiQuery({ name: 'gradeLevel', required: false, description: 'Filter by grade level' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by uniform type' })
  @ApiQuery({ name: 'gender', required: false, description: 'Filter by gender' })
  @ApiQuery({ name: 'season', required: false, description: 'Filter by season' })
  @ApiQuery({ name: 'isActive', required: false, description: 'Filter by active status' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Uniforms retrieved successfully' })
  async findAll(@Query() filters: any) {
    if (Object.keys(filters).length === 0) {
      return await this.uniformService.findAll();
    }
    return await this.uniformService.findByFilters(filters);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active uniforms' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Active uniforms retrieved successfully' })
  async findActive() {
    return await this.uniformService.findActiveUniforms();
  }

  @Get('school/:schoolName')
  @ApiOperation({ summary: 'Get uniforms by school name' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Uniforms retrieved successfully' })
  async findBySchoolName(@Param('schoolName') schoolName: string) {
    return await this.uniformService.findBySchoolName(schoolName);
  }

  @Get('grade/:gradeLevel')
  @ApiOperation({ summary: 'Get uniforms by grade level' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Uniforms retrieved successfully' })
  async findByGradeLevel(@Param('gradeLevel') gradeLevel: string) {
    return await this.uniformService.findByGradeLevel(gradeLevel);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get uniforms by type' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Uniforms retrieved successfully' })
  async findByType(@Param('type') type: string) {
    return await this.uniformService.findByType(type);
  }

  @Get('gender/:gender')
  @ApiOperation({ summary: 'Get uniforms by gender' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Uniforms retrieved successfully' })
  async findByGender(@Param('gender') gender: string) {
    return await this.uniformService.findByGender(gender);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get uniform by product ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Uniform retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Uniform not found' })
  async findByProductId(@Param('productId') productId: string) {
    return await this.uniformService.findByProductId(productId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get uniform by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Uniform retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Uniform not found' })
  async findOne(@Param('id') id: string) {
    return await this.uniformService.findById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get uniform by slug' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Uniform retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Uniform not found' })
  async findBySlug(@Param('slug') slug: string) {
    return await this.uniformService.findBySlug(slug);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update uniform' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Uniform updated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Uniform not found' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Uniform with same slug or product ID already exists' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
  async update(@Param('id') id: string, @Body() updateUniformDto: UpdateUniformDto) {
    return await this.uniformService.updateUniform(id, updateUniformDto);
  }

  @Put(':id/toggle-active')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle uniform active status' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Uniform status toggled successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Uniform not found' })
  async toggleActive(@Param('id') id: string) {
    return await this.uniformService.toggleActiveStatus(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete uniform' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Uniform deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Uniform not found' })
  async remove(@Param('id') id: string) {
    return await this.uniformService.delete(id);
  }
}
