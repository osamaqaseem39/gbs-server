import { IsString, IsNumber, IsOptional, IsEnum, IsArray, IsBoolean, Min, IsUrl, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductType, StockStatus, ProductStatus } from '../schemas/product.schema';
import { Type } from 'class-transformer';

class ProductColorDto {
  @ApiProperty({ description: 'Color ID reference', type: String })
  @IsString()
  colorId: string;

  @ApiPropertyOptional({ description: 'Optional image URL for this color', type: String })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}

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

  @ApiPropertyOptional({ description: 'Currency code', default: 'PKR' })
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

  @ApiPropertyOptional({
    description: 'Available colors with optional images',
    type: [ProductColorDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductColorDto)
  colors?: ProductColorDto[];

  @ApiPropertyOptional({ description: 'Product variations' })
  @IsOptional()
  @IsArray()
  variations?: any[]; // Will be processed to create separate ProductVariation documents

  // Stationery & Book Specific Fields
  @ApiPropertyOptional({ description: 'Material/Paper type (e.g., Cotton, Paper, Cardboard, Plastic)' })
  @IsOptional()
  @IsString()
  material?: string;

  @ApiPropertyOptional({ description: 'Collection/Series name (e.g., Book Series Name)' })
  @IsOptional()
  @IsString()
  collectionName?: string;

  @ApiPropertyOptional({ description: 'Use case (e.g., Educational, Professional, Personal, Art)' })
  @IsOptional()
  @IsString()
  useCase?: string;

  @ApiPropertyOptional({ description: 'Subject area (e.g., Mathematics, Science, English)' })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiPropertyOptional({ description: 'Care instructions' })
  @IsOptional()
  @IsString()
  careInstructions?: string;

  @ApiPropertyOptional({ description: 'Author name for books' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({ description: 'Publisher name' })
  @IsOptional()
  @IsString()
  publisher?: string;

  @ApiPropertyOptional({ description: 'ISBN for books' })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiPropertyOptional({ description: 'Edition number (e.g., 1st Edition, 2024)' })
  @IsOptional()
  @IsString()
  edition?: string;

  @ApiPropertyOptional({ description: 'Number of pages' })
  @IsOptional()
  @IsNumber()
  pageCount?: number;

  @ApiPropertyOptional({ description: 'Language of the book (e.g., English, Urdu)' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ description: 'Binding type (e.g., Hardcover, Paperback, Spiral)' })
  @IsOptional()
  @IsString()
  bindingType?: string;

  @ApiPropertyOptional({ description: 'Special features (e.g., Ruled lines, Perforated pages)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialFeatures?: string[];

  @ApiPropertyOptional({ description: 'Color family (e.g., Pastels, Brights, Neutrals)' })
  @IsOptional()
  @IsString()
  colorFamily?: string;

  @ApiPropertyOptional({ description: 'Pattern type (e.g., Solid, Floral, Geometric, Abstract)' })
  @IsOptional()
  @IsString()
  pattern?: string;

  @ApiPropertyOptional({ description: 'Format/Size (e.g., A4, A5, Letter size)' })
  @IsOptional()
  @IsString()
  format?: string;

  @ApiPropertyOptional({ description: 'Age group (e.g., 5-7 years, 8-10 years)' })
  @IsOptional()
  @IsString()
  ageGroup?: string;

  @ApiPropertyOptional({ description: 'Grade/Class level (e.g., Class 1, Grade 5)' })
  @IsOptional()
  @IsString()
  gradeLevel?: string;

  @ApiPropertyOptional({ description: 'Is this a limited edition item', default: false })
  @IsOptional()
  @IsBoolean()
  isLimitedEdition?: boolean;

  @ApiPropertyOptional({ description: 'Is this a custom made item', default: false })
  @IsOptional()
  @IsBoolean()
  isCustomMade?: boolean;

  @ApiPropertyOptional({ description: 'Estimated delivery time for custom items (in days)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  customDeliveryDays?: number;

  @ApiPropertyOptional({ description: 'Size chart ID for this product' })
  @IsOptional()
  @IsString()
  sizeChart?: string;

  @ApiPropertyOptional({ description: 'Available sizes for this product (A4, A5, etc. for stationery, or S/M/L/XL for uniforms)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  availableSizes?: string[];

  // Uniform Specific Fields
  @ApiPropertyOptional({ description: 'Whether this product is a uniform', default: false })
  @IsOptional()
  @IsBoolean()
  isUniform?: boolean;

  @ApiPropertyOptional({ description: 'Uniform type (e.g., School Uniform, Sports Uniform)' })
  @IsOptional()
  @IsString()
  uniformType?: string;

  @ApiPropertyOptional({ description: 'Gender (Boys, Girls, Unisex)' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: 'Uniform size (S, M, L, XL, etc.)' })
  @IsOptional()
  @IsString()
  uniformSize?: string;

  // Book Set Specific Fields
  @ApiPropertyOptional({ description: 'Whether this is a book set', default: false })
  @IsOptional()
  @IsBoolean()
  isBookSet?: boolean;

  @ApiPropertyOptional({ description: 'Book set type (class, school, subject, custom)' })
  @IsOptional()
  @IsString()
  bookSetType?: string;

  @ApiPropertyOptional({ description: 'Class/Grade level (e.g., Class 1, Grade 5)' })
  @IsOptional()
  @IsString()
  classLevel?: string;

  @ApiPropertyOptional({ description: 'School name for school-specific sets' })
  @IsOptional()
  @IsString()
  schoolName?: string;

  @ApiPropertyOptional({ description: 'Educational board (e.g., O-Levels Cambridge, Matric Punjab Board)' })
  @IsOptional()
  @IsString()
  board?: string;

  @ApiPropertyOptional({ description: 'Books included in the set' })
  @IsOptional()
  @IsArray()
  setItems?: Array<{
    bookId?: string;
    bookName: string;
    subject?: string;
    quantity: number;
  }>;

  @ApiPropertyOptional({ description: 'Total number of books in the set' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalBooksInSet?: number;

  @ApiPropertyOptional({ description: 'Original/cost price (used for inventory cost calculation)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPrice?: number;

  @ApiPropertyOptional({ description: 'Is this product on sale' })
  @IsOptional()
  @IsBoolean()
  isSale?: boolean;

  @ApiPropertyOptional({ description: 'Stock availability status' })
  @IsOptional()
  @IsBoolean()
  inStock?: boolean;
} 