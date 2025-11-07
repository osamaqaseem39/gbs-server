import { IsString, IsOptional, IsMongoId, IsNumber, IsBoolean, IsArray, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class SeriesOrderItemDto {
  @ApiProperty()
  @IsMongoId()
  bookId: string;

  @ApiProperty()
  @IsNumber()
  order: number;

  @ApiProperty()
  @IsString()
  title: string;
}

export class CreateBookSeriesDto {
  @ApiProperty({ description: 'Series name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Series slug' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ description: 'Series description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Author ID' })
  @IsOptional()
  @IsMongoId()
  authorId?: string;

  @ApiPropertyOptional({ description: 'Publisher ID' })
  @IsOptional()
  @IsMongoId()
  publisherId?: string;

  @ApiPropertyOptional({ description: 'Genre' })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiPropertyOptional({ description: 'Target age group' })
  @IsOptional()
  @IsString()
  ageGroup?: string;

  @ApiPropertyOptional({ description: 'Is ongoing series' })
  @IsOptional()
  @IsBoolean()
  isOngoing?: boolean;

  @ApiPropertyOptional({ description: 'First published year' })
  @IsOptional()
  @IsNumber()
  firstPublishedYear?: number;

  @ApiPropertyOptional({ description: 'Last published year' })
  @IsOptional()
  @IsNumber()
  lastPublishedYear?: number;

  @ApiPropertyOptional({ description: 'Cover image URL' })
  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @ApiPropertyOptional({ description: 'Is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Books in series' })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  bookIds?: string[];

  @ApiPropertyOptional({ description: 'Series order' })
  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  seriesOrder?: SeriesOrderItemDto[];
}