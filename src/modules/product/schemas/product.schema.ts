import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ProductDocument = Product & Document;

export enum ProductType {
  SIMPLE = 'simple',
  VARIABLE = 'variable',
  GROUPED = 'grouped',
  EXTERNAL = 'external',
}

export enum StockStatus {
  INSTOCK = 'instock',
  OUTOFSTOCK = 'outofstock',
  ONBACKORDER = 'onbackorder',
}

export enum ProductStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Schema({ timestamps: true })
export class Product {
  @ApiProperty({ description: 'Product ID' })
  _id: string;

  @ApiProperty({ description: 'Product name' })
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty({ description: 'SEO friendly unique URL slug' })
  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @ApiProperty({ description: 'Product description' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ description: 'Short product description' })
  @Prop({ required: true })
  shortDescription: string;

  @ApiProperty({ description: 'Stock Keeping Unit' })
  @Prop({ required: true, unique: true, trim: true })
  sku: string;

  @ApiProperty({ enum: ProductType, description: 'Product type' })
  @Prop({ required: true, enum: ProductType, default: ProductType.SIMPLE })
  type: ProductType;

  @ApiProperty({ description: 'Product price' })
  @Prop({ required: true, min: 0 })
  price: number;

  @ApiProperty({ description: 'Sale price (optional)' })
  @Prop({ min: 0 })
  salePrice?: number;

  @ApiProperty({ description: 'Currency code' })
  @Prop({ required: true, default: 'PKR' })
  currency: string;

  @ApiProperty({ description: 'Stock quantity' })
  @Prop({ required: true, min: 0, default: 0 })
  stockQuantity: number;

  @ApiProperty({ enum: StockStatus, description: 'Stock status' })
  @Prop({ required: true, enum: StockStatus, default: StockStatus.OUTOFSTOCK })
  stockStatus: StockStatus;

  @ApiProperty({ description: 'Product weight' })
  @Prop({ min: 0 })
  weight?: number;

  @ApiProperty({ description: 'Product dimensions' })
  @Prop({
    type: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
    },
  })
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };

  @ApiProperty({ description: 'Whether to manage stock' })
  @Prop({ default: true })
  manageStock: boolean;

  @ApiProperty({ description: 'Whether to allow backorders' })
  @Prop({ default: false })
  allowBackorders: boolean;

  @ApiProperty({ enum: ProductStatus, description: 'Product status' })
  @Prop({ required: true, enum: ProductStatus, default: ProductStatus.DRAFT })
  status: ProductStatus;

  @ApiProperty({ description: 'Category IDs' })
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Category' })
  categories: string[];

  @ApiProperty({ description: 'Tag IDs' })
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Tag' })
  tags: string[];

  @ApiProperty({ description: 'Brand ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Brand' })
  brand?: string;

  @ApiProperty({ description: 'Product attributes as array of attribute IDs' })
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Attribute', default: [] })
  attributes: string[];

  @ApiProperty({ description: 'Product variations' })
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'ProductVariation' })
  variations?: string[];

  @ApiProperty({ description: 'Product images' })
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'ProductImage' })
  images: string[];

  // Stationery & Book Specific Fields
  @ApiProperty({ description: 'Material/Paper type (e.g., Cotton, Paper, Cardboard, Plastic)' })
  @Prop({ type: String, trim: true })
  material?: string;

  @ApiProperty({ description: 'Collection/Series name (e.g., Book Series Name)' })
  @Prop({ type: String, trim: true })
  collectionName?: string;

  @ApiProperty({ description: 'Use case (e.g., Educational, Professional, Personal, Art)' })
  @Prop({ type: String, trim: true })
  useCase?: string;

  @ApiProperty({ description: 'Subject area (e.g., Mathematics, Science, English)' })
  @Prop({ type: String, trim: true })
  subject?: string;

  @ApiProperty({ description: 'Care instructions' })
  @Prop({ type: String })
  careInstructions?: string;

  @ApiProperty({ description: 'Author name for books' })
  @Prop({ type: String, trim: true })
  author?: string;

  @ApiProperty({ description: 'Publisher name' })
  @Prop({ type: String, trim: true })
  publisher?: string;

  @ApiProperty({ description: 'ISBN for books' })
  @Prop({ type: String, trim: true })
  isbn?: string;

  @ApiProperty({ description: 'Edition number (e.g., 1st Edition, 2024)' })
  @Prop({ type: String, trim: true })
  edition?: string;

  @ApiProperty({ description: 'Number of pages' })
  @Prop({ type: Number })
  pageCount?: number;

  @ApiProperty({ description: 'Language of the book (e.g., English, Urdu)' })
  @Prop({ type: String, trim: true })
  language?: string;

  @ApiProperty({ description: 'Binding type (e.g., Hardcover, Paperback, Spiral)' })
  @Prop({ type: String, trim: true })
  bindingType?: string;

  @ApiProperty({ description: 'Special features (e.g., Ruled lines, Perforated pages)' })
  @Prop({ type: [String] })
  specialFeatures?: string[];

  @ApiProperty({ description: 'Color family (e.g., Pastels, Brights, Neutrals)' })
  @Prop({ type: String, trim: true })
  colorFamily?: string;

  @ApiProperty({ description: 'Pattern type (e.g., Solid, Floral, Geometric, Abstract)' })
  @Prop({ type: String, trim: true })
  pattern?: string;

  @ApiProperty({ description: 'Format/Size (e.g., A4, A5, Letter size)' })
  @Prop({ type: String, trim: true })
  format?: string;

  @ApiProperty({ description: 'Age group (e.g., 5-7 years, 8-10 years)' })
  @Prop({ type: String, trim: true })
  ageGroup?: string;

  @ApiProperty({ description: 'Grade/Class level (e.g., Class 1, Grade 5)' })
  @Prop({ type: String, trim: true })
  gradeLevel?: string;

  @ApiProperty({ description: 'Is this a limited edition item' })
  @Prop({ default: false })
  isLimitedEdition?: boolean;

  @ApiProperty({ description: 'Is this a custom made item' })
  @Prop({ default: false })
  isCustomMade?: boolean;

  @ApiProperty({ description: 'Estimated delivery time for custom items (in days)' })
  @Prop({ min: 0 })
  customDeliveryDays?: number;

  @ApiProperty({ description: 'Size chart ID for this product' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'SizeChart' })
  sizeChart?: string;

  @ApiProperty({ description: 'Size chart image URL (direct)' })
  @Prop({ type: String })
  sizeChartImageUrl?: string;

  @ApiProperty({ description: 'Available sizes for this product (A4, A5, etc. for stationery, or S/M/L/XL for uniforms)' })
  @Prop({ type: [String] })
  availableSizes?: string[];

  // Uniform Specific Fields
  @ApiProperty({ description: 'Whether this product is a uniform', default: false })
  @Prop({ default: false })
  isUniform?: boolean;

  @ApiProperty({ description: 'Uniform type (e.g., School Uniform, Sports Uniform)' })
  @Prop({ type: String, trim: true })
  uniformType?: string;

  @ApiProperty({ description: 'Gender (Boys, Girls, Unisex)' })
  @Prop({ type: String, trim: true })
  gender?: string;

  @ApiProperty({ description: 'Uniform size (S, M, L, XL, etc.)' })
  @Prop({ type: String, trim: true })
  uniformSize?: string;

  // Book Set Specific Fields
  @ApiProperty({ description: 'Whether this is a book set', default: false })
  @Prop({ default: false })
  isBookSet?: boolean;

  @ApiProperty({ description: 'Book set type (class, school, subject, custom)' })
  @Prop({ type: String, enum: ['class', 'school', 'subject', 'custom'], trim: true })
  bookSetType?: string;

  @ApiProperty({ description: 'Class/Grade level (e.g., Class 1, Grade 5)' })
  @Prop({ type: String, trim: true })
  classLevel?: string;

  @ApiProperty({ description: 'School name for school-specific sets' })
  @Prop({ type: String, trim: true })
  schoolName?: string;

  @ApiProperty({ description: 'Educational board (e.g., O-Levels Cambridge, Matric Punjab Board)' })
  @Prop({ type: String, trim: true })
  board?: string;

  @ApiProperty({ description: 'Books included in the set' })
  @Prop({
    type: [{
      bookId: { type: String },
      bookName: { type: String, required: true },
      subject: { type: String },
      quantity: { type: Number, default: 1 },
    }],
  })
  setItems?: Array<{
    bookId?: string;
    bookName: string;
    subject?: string;
    quantity: number;
  }>;

  @ApiProperty({ description: 'Total number of books in the set' })
  @Prop({ type: Number, min: 0 })
  totalBooksInSet?: number;

  // UI-specific fields
  @ApiProperty({ description: 'Original price before sale' })
  @Prop({ min: 0 })
  originalPrice?: number;

  @ApiProperty({ description: 'Product rating (0-5)' })
  @Prop({ min: 0, max: 5 })
  rating?: number;

  @ApiProperty({ description: 'Number of reviews' })
  @Prop({ min: 0 })
  reviews?: number;

  @ApiProperty({ description: 'Is this a new product' })
  @Prop({ default: false })
  isNew?: boolean;

  @ApiProperty({ description: 'Is this product on sale' })
  @Prop({ default: false })
  isSale?: boolean;

  @ApiProperty({ description: 'Product features list' })
  @Prop({ type: [String], default: [] })
  features?: string[];

  @ApiProperty({ description: 'Available colors with images' })
  @Prop({
    type: [{
      colorId: { type: MongooseSchema.Types.ObjectId, ref: 'Color', required: true },
      imageUrl: { type: String },
    }],
    default: [],
  })
  colors?: Array<{
    colorId: string;
    imageUrl?: string;
  }>;

  @ApiProperty({ description: 'Stock availability status' })
  @Prop({ default: true })
  inStock?: boolean;

  @ApiProperty({ description: 'Stock count for display' })
  @Prop({ min: 0 })
  stockCount?: number;

  @ApiProperty({ description: 'Product weight for shipping' })
  @Prop({ min: 0 })
  shippingWeight?: number;

  @ApiProperty({ description: 'Product dimensions for shipping' })
  @Prop({
    type: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
    },
  })
  shippingDimensions?: {
    length: number;
    width: number;
    height: number;
  };

  @ApiProperty({ description: 'Product is active' })
  @Prop({ default: true })
  isActive?: boolean;

  @ApiProperty({ description: 'SEO data' })
  @Prop({
    type: {
      title: { type: String },
      description: { type: String },
      keywords: { type: [String] },
      slug: { type: String },
      canonicalUrl: { type: String },
      ogImage: { type: String },
      noIndex: { type: Boolean, default: false },
      noFollow: { type: Boolean, default: false },
    },
  })
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    slug?: string;
    canonicalUrl?: string;
    ogImage?: string;
    noIndex: boolean;
    noFollow: boolean;
  };

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Indexes for better performance
ProductSchema.index({ brand: 1 });
ProductSchema.index({ categories: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });

// Stationery & Book Specific Indexes
ProductSchema.index({ material: 1 });
ProductSchema.index({ collectionName: 1 });
ProductSchema.index({ useCase: 1 });
ProductSchema.index({ subject: 1 });
ProductSchema.index({ season: 1 });
ProductSchema.index({ publisher: 1 });
ProductSchema.index({ author: 1 });
ProductSchema.index({ specialFeatures: 1 });
ProductSchema.index({ colorFamily: 1 });
ProductSchema.index({ pattern: 1 });
ProductSchema.index({ format: 1 });
ProductSchema.index({ ageGroup: 1 });
ProductSchema.index({ gradeLevel: 1 });
ProductSchema.index({ board: 1 });
ProductSchema.index({ schoolName: 1 });
ProductSchema.index({ classLevel: 1 });
ProductSchema.index({ isbn: 1 });
// Uniform Specific Indexes
ProductSchema.index({ isUniform: 1 });
ProductSchema.index({ uniformType: 1 });
ProductSchema.index({ gender: 1 });
// Book Set Specific Indexes
ProductSchema.index({ isBookSet: 1 });
ProductSchema.index({ bookSetType: 1 });
ProductSchema.index({ isLimitedEdition: 1 });
ProductSchema.index({ isCustomMade: 1 });
ProductSchema.index({ sizeChart: 1 });
ProductSchema.index({ availableSizes: 1 });

// UI-specific indexes
ProductSchema.index({ originalPrice: 1 });
ProductSchema.index({ rating: 1 });
ProductSchema.index({ reviews: 1 });
ProductSchema.index({ isNew: 1 });
ProductSchema.index({ isSale: 1 });
ProductSchema.index({ features: 1 });
ProductSchema.index({ colors: 1 });
ProductSchema.index({ inStock: 1 });
ProductSchema.index({ stockCount: 1 });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ attributes: 1 }); 