import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsArray, IsOptional, IsBoolean, IsMongoId, IsUrl } from 'class-validator';
import { UniformType, UniformGender, UniformSize } from '../schemas/uniform.schema';

export class CreateUniformDto {
  @ApiProperty({ description: 'Uniform name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Uniform slug' })
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Uniform description' })
  @IsString()
  description: string;

  @ApiProperty({ enum: UniformType, description: 'Uniform type' })
  @IsEnum(UniformType)
  type: UniformType;

  @ApiProperty({ enum: UniformGender, description: 'Gender category' })
  @IsEnum(UniformGender)
  gender: UniformGender;

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

  @ApiProperty({ description: 'Season (Summer/Winter)' })
  @IsString()
  season: string;

  @ApiProperty({ description: 'Available sizes', enum: UniformSize, isArray: true })
  @IsArray()
  @IsEnum(UniformSize, { each: true })
  availableSizes: UniformSize[];

  @ApiProperty({ description: 'Colors', type: [String] })
  @IsArray()
  @IsString({ each: true })
  colors: string[];

  @ApiProperty({ description: 'Material composition' })
  @IsString()
  material: string;

  @ApiPropertyOptional({ description: 'Care instructions' })
  @IsOptional()
  @IsString()
  careInstructions?: string;

  @ApiProperty({ description: 'Product ID reference' })
  @IsMongoId()
  productId: string;

  @ApiProperty({ description: 'Category ID' })
  @IsMongoId()
  categoryId: string;

  @ApiPropertyOptional({ description: 'Brand ID' })
  @IsOptional()
  @IsMongoId()
  brandId?: string;

  @ApiPropertyOptional({ description: 'Is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Images', type: [String] })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiPropertyOptional({ description: 'Size chart URL' })
  @IsOptional()
  @IsUrl()
  sizeChartUrl?: string;

  @ApiPropertyOptional({ description: 'Custom specifications' })
  @IsOptional()
  specifications?: Record<string, any>;
}
