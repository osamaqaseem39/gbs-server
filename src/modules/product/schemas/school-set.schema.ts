import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type SchoolSetDocument = SchoolSet & Document;

export enum SchoolSetType {
  GRADE_SET = 'grade_set',
  SUBJECT_SET = 'subject_set',
  UNIFORM_SET = 'uniform_set',
  STATIONERY_SET = 'stationery_set',
  COMPLETE_SET = 'complete_set',
}

export enum SchoolSetStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SEASONAL = 'seasonal',
  DISCONTINUED = 'discontinued',
}

@Schema({ timestamps: true })
export class SchoolSet {
  @ApiProperty({ description: 'School set ID' })
  _id: string;

  @ApiProperty({ description: 'Set name' })
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty({ description: 'Set slug' })
  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @ApiProperty({ description: 'Set description' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ description: 'Short description' })
  @Prop({ required: true })
  shortDescription: string;

  @ApiProperty({ enum: SchoolSetType, description: 'Set type' })
  @Prop({ required: true, enum: SchoolSetType })
  type: SchoolSetType;

  @ApiProperty({ enum: SchoolSetStatus, description: 'Set status' })
  @Prop({ required: true, enum: SchoolSetStatus, default: SchoolSetStatus.ACTIVE })
  status: SchoolSetStatus;

  @ApiProperty({ description: 'School name' })
  @Prop({ required: true, trim: true })
  schoolName: string;

  @ApiProperty({ description: 'School logo URL' })
  @Prop()
  schoolLogoUrl?: string;

  @ApiProperty({ description: 'Grade/Class level' })
  @Prop({ required: true, trim: true })
  gradeLevel: string;

  @ApiProperty({ description: 'Academic year' })
  @Prop({ required: true })
  academicYear: string;

  @ApiProperty({ description: 'Board/Curriculum' })
  @Prop({ required: true, trim: true })
  board: string;

  @ApiProperty({ description: 'Subject (for subject-specific sets)' })
  @Prop()
  subject?: string;

  @ApiProperty({ description: 'Season (Summer/Winter/All Season)' })
  @Prop({ required: true, trim: true })
  season: string;

  @ApiProperty({ description: 'Gender category' })
  @Prop({ required: true, trim: true })
  gender: string;

  @ApiProperty({ description: 'Set price' })
  @Prop({ required: true, min: 0 })
  price: number;

  @ApiProperty({ description: 'Original price (before discount)' })
  @Prop({ min: 0 })
  originalPrice?: number;

  @ApiProperty({ description: 'Discount percentage' })
  @Prop({ min: 0, max: 100 })
  discountPercentage?: number;

  @ApiProperty({ description: 'Currency code' })
  @Prop({ required: true, default: 'INR' })
  currency: string;

  @ApiProperty({ description: 'Stock quantity' })
  @Prop({ required: true, min: 0, default: 0 })
  stockQuantity: number;

  @ApiProperty({ description: 'Minimum order quantity' })
  @Prop({ min: 1, default: 1 })
  minOrderQuantity: number;

  @ApiProperty({ description: 'Maximum order quantity' })
  @Prop({ min: 1 })
  maxOrderQuantity?: number;

  @ApiProperty({ description: 'Set items' })
  @Prop({
    type: [{
      productId: { type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 },
      isRequired: { type: Boolean, default: true },
      notes: String,
    }],
    required: true,
  })
  items: Array<{
    productId: string;
    quantity: number;
    isRequired: boolean;
    notes?: string;
  }>;

  @ApiProperty({ description: 'Set images' })
  @Prop({ type: [String] })
  images?: string[];

  @ApiProperty({ description: 'Category ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  categoryId: string;

  @ApiProperty({ description: 'Brand ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Brand' })
  brandId?: string;

  @ApiProperty({ description: 'Tags' })
  @Prop({ type: [String] })
  tags?: string[];

  @ApiProperty({ description: 'Key features' })
  @Prop({ type: [String] })
  keyFeatures?: string[];

  @ApiProperty({ description: 'Benefits' })
  @Prop({ type: [String] })
  benefits?: string[];

  @ApiProperty({ description: 'Usage instructions' })
  @Prop()
  usageInstructions?: string;

  @ApiProperty({ description: 'Care instructions' })
  @Prop()
  careInstructions?: string;

  @ApiProperty({ description: 'Warranty information' })
  @Prop()
  warranty?: string;

  @ApiProperty({ description: 'Return policy' })
  @Prop()
  returnPolicy?: string;

  @ApiProperty({ description: 'Shipping information' })
  @Prop()
  shippingInfo?: string;

  @ApiProperty({ description: 'Is featured set' })
  @Prop({ default: false })
  isFeatured: boolean;

  @ApiProperty({ description: 'Is bestseller' })
  @Prop({ default: false })
  isBestseller: boolean;

  @ApiProperty({ description: 'Is new arrival' })
  @Prop({ default: false })
  isNewArrival: boolean;

  @ApiProperty({ description: 'SEO title' })
  @Prop()
  seoTitle?: string;

  @ApiProperty({ description: 'SEO description' })
  @Prop()
  seoDescription?: string;

  @ApiProperty({ description: 'SEO keywords' })
  @Prop({ type: [String] })
  seoKeywords?: string[];

  @ApiProperty({ description: 'Custom fields' })
  @Prop({ type: MongooseSchema.Types.Mixed })
  customFields?: Record<string, any>;

  @ApiProperty({ description: 'Is active' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Created by user ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Admin' })
  createdBy?: string;

  @ApiProperty({ description: 'Last updated by user ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Admin' })
  updatedBy?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const SchoolSetSchema = SchemaFactory.createForClass(SchoolSet);

// Indexes
SchoolSetSchema.index({ slug: 1 }, { unique: true });
SchoolSetSchema.index({ schoolName: 1 });
SchoolSetSchema.index({ gradeLevel: 1 });
SchoolSetSchema.index({ board: 1 });
SchoolSetSchema.index({ type: 1 });
SchoolSetSchema.index({ status: 1 });
SchoolSetSchema.index({ isActive: 1 });
SchoolSetSchema.index({ isFeatured: 1 });
SchoolSetSchema.index({ academicYear: 1 });
