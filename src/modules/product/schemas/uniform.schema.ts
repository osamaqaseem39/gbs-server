import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UniformDocument = Uniform & Document;

export enum UniformType {
  SCHOOL = 'school',
  SPORTS = 'sports',
  FORMAL = 'formal',
  CASUAL = 'casual',
}

export enum UniformGender {
  BOYS = 'boys',
  GIRLS = 'girls',
  UNISEX = 'unisex',
}

export enum UniformSize {
  XS = 'xs',
  S = 's',
  M = 'm',
  L = 'l',
  XL = 'xl',
  XXL = 'xxl',
  XXXL = 'xxxl',
}

@Schema({ timestamps: true })
export class Uniform {
  @ApiProperty({ description: 'Uniform ID' })
  _id: string;

  @ApiProperty({ description: 'Uniform name' })
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty({ description: 'Uniform slug' })
  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @ApiProperty({ description: 'Uniform description' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ enum: UniformType, description: 'Uniform type' })
  @Prop({ required: true, enum: UniformType })
  type: UniformType;

  @ApiProperty({ enum: UniformGender, description: 'Gender category' })
  @Prop({ required: true, enum: UniformGender })
  gender: UniformGender;

  @ApiProperty({ description: 'School name' })
  @Prop({ required: true, trim: true })
  schoolName: string;

  @ApiProperty({ description: 'School logo URL' })
  @Prop()
  schoolLogoUrl?: string;

  @ApiProperty({ description: 'Grade/Class level' })
  @Prop({ required: true, trim: true })
  gradeLevel: string;

  @ApiProperty({ description: 'Season (Summer/Winter)' })
  @Prop({ required: true, trim: true })
  season: string;

  @ApiProperty({ description: 'Available sizes' })
  @Prop({ type: [String], enum: UniformSize, required: true })
  availableSizes: UniformSize[];

  @ApiProperty({ description: 'Colors' })
  @Prop({ type: [String], required: true })
  colors: string[];

  @ApiProperty({ description: 'Material composition' })
  @Prop({ required: true })
  material: string;

  @ApiProperty({ description: 'Care instructions' })
  @Prop()
  careInstructions?: string;

  @ApiProperty({ description: 'Product ID reference' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  productId: string;

  @ApiProperty({ description: 'Category ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  categoryId: string;

  @ApiProperty({ description: 'Brand ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Brand' })
  brandId?: string;

  @ApiProperty({ description: 'Is active' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Images' })
  @Prop({ type: [String] })
  images?: string[];

  @ApiProperty({ description: 'Size chart URL' })
  @Prop()
  sizeChartUrl?: string;

  @ApiProperty({ description: 'Custom specifications' })
  @Prop({ type: MongooseSchema.Types.Mixed })
  specifications?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

export const UniformSchema = SchemaFactory.createForClass(Uniform);

// Indexes
UniformSchema.index({ slug: 1 }, { unique: true });
UniformSchema.index({ schoolName: 1 });
UniformSchema.index({ gradeLevel: 1 });
UniformSchema.index({ type: 1 });
UniformSchema.index({ gender: 1 });
UniformSchema.index({ isActive: 1 });
