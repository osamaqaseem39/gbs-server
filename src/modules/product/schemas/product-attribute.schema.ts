import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ProductAttributeDocument = ProductAttribute & Document;

@Schema({ timestamps: true })
export class ProductAttribute {
  @ApiProperty({ description: 'Product attribute ID' })
  _id: string;

  @ApiProperty({ description: 'Product ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  productId: string;

  @ApiProperty({ description: 'Attribute ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Attribute' })
  attributeId: string;

  @ApiProperty({ description: 'Attribute value' })
  @Prop({ required: true })
  value: string | number | boolean;

  @ApiProperty({ description: 'Display value' })
  @Prop()
  displayValue?: string;

  @ApiProperty({ description: 'Sort order' })
  @Prop({ default: 0 })
  sortOrder: number;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export const ProductAttributeSchema = SchemaFactory.createForClass(ProductAttribute);

// Indexes
ProductAttributeSchema.index({ productId: 1 });
ProductAttributeSchema.index({ attributeId: 1 });
ProductAttributeSchema.index({ productId: 1, attributeId: 1 }, { unique: true });
ProductAttributeSchema.index({ sortOrder: 1 });

