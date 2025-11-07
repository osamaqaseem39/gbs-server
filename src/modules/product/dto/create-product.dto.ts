import { IsString, IsNumber, IsOptional, IsEnum, IsArray, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductType, StockStatus, ProductStatus } from '../schemas/product.schema';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'SEO friendly unique URL slug' })
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Product description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Short product description' })
  @IsString()
  shortDescription: string;

  @ApiProperty({ description: 'Stock Keeping Unit' })
  @IsString()
  sku: string;

  @ApiProperty({ enum: ProductType, description: 'Product type' })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty({ description: 'Product price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ description: 'Sale price' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @ApiPropertyOptional({ description: 'Currency code', default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ description: 'Stock quantity' })
  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @ApiProperty({ enum: StockStatus, description: 'Stock status' })
  @IsEnum(StockStatus)
  stockStatus: StockStatus;

  @ApiPropertyOptional({ description: 'Product weight' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ description: 'Product dimensions' })
  @IsOptional()
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };

  @ApiPropertyOptional({ description: 'Whether to manage stock', default: true })
  @IsOptional()
  @IsBoolean()
  manageStock?: boolean;

  @ApiPropertyOptional({ description: 'Whether to allow backorders', default: false })
  @IsOptional()
  @IsBoolean()
  allowBackorders?: boolean;

  @ApiProperty({ enum: ProductStatus, description: 'Product status' })
  @IsEnum(ProductStatus)
  status: ProductStatus;

  @ApiPropertyOptional({ description: 'Product kind ID for dynamic fields' })
  @IsOptional()
  @IsString()
  productKind?: string;

  @ApiPropertyOptional({ description: 'Category IDs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiPropertyOptional({ description: 'Tag IDs' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Brand ID' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ description: 'Product attributes' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attributes?: string[];

  @ApiPropertyOptional({ description: 'Product images' })
  @IsOptional()
  @IsArray()
  images?: {
    url: string;
    altText?: string;
    position: number;
  }[];

  @ApiPropertyOptional({ description: 'Custom fields matching selected product kind' })
  @IsOptional()
  customFields?: Record<string, any>;
} 