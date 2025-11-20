import { IsOptional, IsString, IsArray, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ProductFilterDto {
  // Basic filters
  @ApiPropertyOptional({ description: 'Search term' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Category IDs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiPropertyOptional({ description: 'Brand IDs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  brands?: string[];

  @ApiPropertyOptional({ description: 'Minimum price' })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price' })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Product status' })
  @IsOptional()
  @IsString()
  status?: string;

  // Stationery & Book Specific Filters
  @ApiPropertyOptional({ description: 'Material types' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  materials?: string[];

  @ApiPropertyOptional({ description: 'Collections' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  collectionNames?: string[];

  @ApiPropertyOptional({ description: 'Use cases' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  useCases?: string[];

  @ApiPropertyOptional({ description: 'Seasons' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seasons?: string[];

  @ApiPropertyOptional({ description: 'Publishers' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  publishers?: string[];

  @ApiPropertyOptional({ description: 'Special features' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialFeatures?: string[];

  @ApiPropertyOptional({ description: 'Color families' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  colorFamilies?: string[];

  @ApiPropertyOptional({ description: 'Pattern types' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  patterns?: string[];

  @ApiPropertyOptional({ description: 'Formats' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  formats?: string[];

  @ApiPropertyOptional({ description: 'Age groups' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ageGroups?: string[];

  @ApiPropertyOptional({ description: 'Grade/Class levels' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gradeLevels?: string[];

  @ApiPropertyOptional({ description: 'Subjects' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjects?: string[];

  // Uniform Filters
  @ApiPropertyOptional({ description: 'Filter by uniforms only' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isUniform?: boolean;

  @ApiPropertyOptional({ description: 'Uniform types' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  uniformTypes?: string[];

  @ApiPropertyOptional({ description: 'Genders' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genders?: string[];

  // Book Set Filters
  @ApiPropertyOptional({ description: 'Filter by book sets only' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isBookSet?: boolean;

  @ApiPropertyOptional({ description: 'Book set types' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  bookSetTypes?: string[];

  @ApiPropertyOptional({ description: 'Class levels' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  classLevels?: string[];

  @ApiPropertyOptional({ description: 'School names' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  schools?: string[];

  @ApiPropertyOptional({ description: 'Educational boards (e.g., O-Levels Cambridge, Matric Punjab Board)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  boards?: string[];

  @ApiPropertyOptional({ description: 'Available sizes' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sizes?: string[];

  @ApiPropertyOptional({ description: 'Limited edition items only' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isLimitedEdition?: boolean;

  @ApiPropertyOptional({ description: 'Custom made items only' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isCustomMade?: boolean;

  // Pagination
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  // Sorting
  @ApiPropertyOptional({ description: 'Sort field' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}