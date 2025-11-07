import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ProductKindDocument = ProductKind & Document;

@Schema({ timestamps: true })
export class ProductKind {
  @ApiProperty({ description: 'Product kind ID' })
  _id: string;

  @ApiProperty({ description: 'Unique key for the product kind' })
  @Prop({ required: true, unique: true, trim: true })
  key: string;

  @ApiProperty({ description: 'Display name' })
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty({ description: 'Description', required: false })
  @Prop()
  description?: string;

  @ApiProperty({ description: 'Whether the kind is active' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Field definitions for this kind' })
  @Prop({ type: [Object], default: [] })
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'number' | 'boolean' | 'select' | 'date';
    required?: boolean;
    options?: string[];
    placeholder?: string;
  }>;

  createdAt: Date;
  updatedAt: Date;
}

export const ProductKindSchema = SchemaFactory.createForClass(ProductKind);

ProductKindSchema.index({ key: 1 }, { unique: true });
