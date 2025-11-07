import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsEnum, 
  IsArray, 
  IsOptional, 
  IsBoolean, 
  IsMongoId, 
  IsUrl, 
  IsNumber, 
  IsDateString,
  Min,
  Max
} from 'class-validator';
import { BookFormat, BookLanguage, BookSubject } from '../schemas/book-specification.schema';

export class CreateBookSpecificationDto {
  @ApiProperty({ description: 'Product ID reference' })
  @IsMongoId()
  productId: string;

  @ApiPropertyOptional({ description: 'ISBN' })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiPropertyOptional({ description: 'ISBN-13' })
  @IsOptional()
  @IsString()
  isbn13?: string;

  @ApiPropertyOptional({ description: 'ISBN-10' })
  @IsOptional()
  @IsString()
  isbn10?: string;

  @ApiProperty({ enum: BookFormat, description: 'Book format' })
  @IsEnum(BookFormat)
  format: BookFormat;

  @ApiProperty({ enum: BookLanguage, description: 'Primary language' })
  @IsEnum(BookLanguage)
  language: BookLanguage;

  @ApiPropertyOptional({ description: 'Number of pages' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  pageCount?: number;

  @ApiPropertyOptional({ description: 'Book dimensions' })
  @IsOptional()
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };

  @ApiPropertyOptional({ description: 'Book weight in grams' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ description: 'Publication date' })
  @IsOptional()
  @IsDateString()
  publicationDate?: string;

  @ApiPropertyOptional({ description: 'Edition' })
  @IsOptional()
  @IsString()
  edition?: string;

  @ApiPropertyOptional({ description: 'Volume number' })
  @IsOptional()
  @IsString()
  volume?: string;

  @ApiPropertyOptional({ description: 'Series name' })
  @IsOptional()
  @IsString()
  seriesName?: string;

  @ApiPropertyOptional({ description: 'Series number' })
  @IsOptional()
  @IsNumber()
  seriesNumber?: number;

  @ApiPropertyOptional({ description: 'Age group/Reading level' })
  @IsOptional()
  @IsString()
  ageGroup?: string;

  @ApiPropertyOptional({ description: 'Grade level' })
  @IsOptional()
  @IsString()
  gradeLevel?: string;

  @ApiPropertyOptional({ enum: BookSubject, description: 'Subject category' })
  @IsOptional()
  @IsEnum(BookSubject)
  subject?: BookSubject;

  @ApiPropertyOptional({ description: 'Board/Curriculum' })
  @IsOptional()
  @IsString()
  board?: string;

  @ApiPropertyOptional({ description: 'Syllabus year' })
  @IsOptional()
  @IsString()
  syllabusYear?: string;

  @ApiPropertyOptional({ description: 'Author names', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  authors?: string[];

  @ApiPropertyOptional({ description: 'Editor names', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  editors?: string[];

  @ApiPropertyOptional({ description: 'Illustrator names', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  illustrators?: string[];

  @ApiPropertyOptional({ description: 'Publisher name' })
  @IsOptional()
  @IsString()
  publisher?: string;

  @ApiPropertyOptional({ description: 'Publisher ID reference' })
  @IsOptional()
  @IsMongoId()
  publisherId?: string;

  @ApiPropertyOptional({ description: 'Author ID reference' })
  @IsOptional()
  @IsMongoId()
  authorId?: string;

  @ApiPropertyOptional({ description: 'Book series ID reference' })
  @IsOptional()
  @IsMongoId()
  bookSeriesId?: string;

  @ApiPropertyOptional({ description: 'Table of contents' })
  @IsOptional()
  @IsString()
  tableOfContents?: string;

  @ApiPropertyOptional({ description: 'Book description/Summary' })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional({ description: 'Key features', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keyFeatures?: string[];

  @ApiPropertyOptional({ description: 'Learning objectives', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  learningObjectives?: string[];

  @ApiPropertyOptional({ description: 'Prerequisites' })
  @IsOptional()
  @IsString()
  prerequisites?: string;

  @ApiPropertyOptional({ description: 'Target audience' })
  @IsOptional()
  @IsString()
  targetAudience?: string;

  @ApiPropertyOptional({ description: 'Book cover image URL' })
  @IsOptional()
  @IsUrl()
  coverImageUrl?: string;

  @ApiPropertyOptional({ description: 'Sample pages images', type: [String] })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  samplePages?: string[];

  @ApiPropertyOptional({ description: 'Is digital version available' })
  @IsOptional()
  @IsBoolean()
  hasDigitalVersion?: boolean;

  @ApiPropertyOptional({ description: 'Is audio version available' })
  @IsOptional()
  @IsBoolean()
  hasAudioVersion?: boolean;

  @ApiPropertyOptional({ description: 'Digital format URLs' })
  @IsOptional()
  digitalFormats?: Record<string, string>;

  @ApiPropertyOptional({ description: 'Awards and recognition', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  awards?: string[];

  @ApiPropertyOptional({ description: 'Reviews and ratings' })
  @IsOptional()
  reviews?: {
    averageRating?: number;
    totalReviews?: number;
    reviews?: string[];
  };

  @ApiPropertyOptional({ description: 'Additional specifications' })
  @IsOptional()
  additionalSpecs?: Record<string, any>;
}
