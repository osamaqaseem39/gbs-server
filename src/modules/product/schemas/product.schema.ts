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
  brandId?: string;

  @ApiProperty({ description: 'Size chart ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'SizeChart' })
  sizeChartId?: string;

  @ApiProperty({ description: 'Product variations' })
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'ProductVariation' })
  variations?: string[];

  @ApiProperty({ description: 'Product images' })
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'ProductImage' })
  images: string[];

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
ProductSchema.index({ slug: 1 });
ProductSchema.index({ sku: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ brandId: 1 });
ProductSchema.index({ categories: 1 });
ProductSchema.index({ sizeChartId: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ name: 'text', description: 'text', shortDescription: 'text' }); 