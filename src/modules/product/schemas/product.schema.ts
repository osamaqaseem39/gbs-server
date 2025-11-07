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
}

// Dynamic product kinds are modeled in a separate collection and referenced here

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
  @Prop({ required: true, default: 'USD' })
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

  @ApiProperty({ description: 'Reference to dynamic product kind' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ProductKind' })
  productKind?: string;

  @ApiProperty({ description: 'Category IDs' })
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Category' })
  categories: string[];

  @ApiProperty({ description: 'Tag IDs' })
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Tag' })
  tags: string[];

  @ApiProperty({ description: 'Brand ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Brand' })
  brand?: string;

  @ApiProperty({ description: 'Product attributes' })
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'ProductAttribute' })
  attributes: string[];

  @ApiProperty({ description: 'Product variations' })
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'ProductVariation' })
  variations?: string[];

  @ApiProperty({ description: 'Product images' })
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'ProductImage' })
  images: string[];

  @ApiProperty({ description: 'Custom fields for the selected product kind', required: false })
  @Prop({ type: MongooseSchema.Types.Mixed })
  customFields?: Record<string, any>;

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
ProductSchema.index({ productKind: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 }); 