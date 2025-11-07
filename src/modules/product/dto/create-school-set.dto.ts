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
  Min,
  Max,
  ValidateNested,
  IsObject
} from 'class-validator';
import { Type } from 'class-transformer';
import { SchoolSetType, SchoolSetStatus } from '../schemas/school-set.schema';

export class SchoolSetItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsMongoId()
  productId: string;

  @ApiProperty({ description: 'Quantity' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({ description: 'Is required item' })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateSchoolSetDto {
  @ApiProperty({ description: 'Set name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Set slug' })
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Set description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Short description' })
  @IsString()
  shortDescription: string;

  @ApiProperty({ enum: SchoolSetType, description: 'Set type' })
  @IsEnum(SchoolSetType)
  type: SchoolSetType;

  @ApiPropertyOptional({ enum: SchoolSetStatus, description: 'Set status' })
  @IsOptional()
  @IsEnum(SchoolSetStatus)
  status?: SchoolSetStatus;

  @ApiProperty({ description: 'School name' })
  @IsString()
  schoolName: string;

  @ApiPropertyOptional({ description: 'School logo URL' })
  @IsOptional()
  @IsUrl()
  schoolLogoUrl?: string;

  @ApiProperty({ description: 'Grade/Class level' })
  @IsString()
  gradeLevel: string;

  @ApiProperty({ description: 'Academic year' })
  @IsString()
  academicYear: string;

  @ApiProperty({ description: 'Board/Curriculum' })
  @IsString()
  board: string;

  @ApiPropertyOptional({ description: 'Subject (for subject-specific sets)' })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({ description: 'Season' })
  @IsString()
  season: string;

  @ApiProperty({ description: 'Gender category' })
  @IsString()
  gender: string;

  @ApiProperty({ description: 'Set price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ description: 'Original price' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPrice?: number;

  @ApiPropertyOptional({ description: 'Discount percentage' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage?: number;

  @ApiPropertyOptional({ description: 'Currency code' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ description: 'Stock quantity' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity?: number;

  @ApiPropertyOptional({ description: 'Minimum order quantity' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  minOrderQuantity?: number;

  @ApiPropertyOptional({ description: 'Maximum order quantity' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxOrderQuantity?: number;

  @ApiProperty({ description: 'Set items', type: [SchoolSetItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SchoolSetItemDto)
  items: SchoolSetItemDto[];

  @ApiPropertyOptional({ description: 'Set images', type: [String] })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiProperty({ description: 'Category ID' })
  @IsMongoId()
  categoryId: string;

  @ApiPropertyOptional({ description: 'Brand ID' })
  @IsOptional()
  @IsMongoId()
  brandId?: string;

  @ApiPropertyOptional({ description: 'Tags', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Key features', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keyFeatures?: string[];

  @ApiPropertyOptional({ description: 'Benefits', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @ApiPropertyOptional({ description: 'Usage instructions' })
  @IsOptional()
  @IsString()
  usageInstructions?: string;

  @ApiPropertyOptional({ description: 'Care instructions' })
  @IsOptional()
  @IsString()
  careInstructions?: string;

  @ApiPropertyOptional({ description: 'Warranty information' })
  @IsOptional()
  @IsString()
  warranty?: string;

  @ApiPropertyOptional({ description: 'Return policy' })
  @IsOptional()
  @IsString()
  returnPolicy?: string;

  @ApiPropertyOptional({ description: 'Shipping information' })
  @IsOptional()
  @IsString()
  shippingInfo?: string;

  @ApiPropertyOptional({ description: 'Is featured set' })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Is bestseller' })
  @IsOptional()
  @IsBoolean()
  isBestseller?: boolean;

  @ApiPropertyOptional({ description: 'Is new arrival' })
  @IsOptional()
  @IsBoolean()
  isNewArrival?: boolean;

  @ApiPropertyOptional({ description: 'SEO title' })
  @IsOptional()
  @IsString()
  seoTitle?: string;

  @ApiPropertyOptional({ description: 'SEO description' })
  @IsOptional()
  @IsString()
  seoDescription?: string;

  @ApiPropertyOptional({ description: 'SEO keywords', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seoKeywords?: string[];

  @ApiPropertyOptional({ description: 'Custom fields' })
  @IsOptional()
  @IsObject()
  customFields?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Created by user ID' })
  @IsOptional()
  @IsMongoId()
  createdBy?: string;
}
