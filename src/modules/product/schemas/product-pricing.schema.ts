import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ProductPricingDocument = ProductPricing & Document;

@Schema({ timestamps: true })
export class ProductPricing {
  @ApiProperty({ description: 'Pricing ID' })
  _id: string;

  @ApiProperty({ description: 'Product ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Product', unique: true })
  productId: string;

  @ApiProperty({ description: 'Base price' })
  @Prop({ required: true, min: 0 })
  basePrice: number;

  @ApiProperty({ description: 'Sale price' })
  @Prop({ min: 0 })
  salePrice?: number;

  @ApiProperty({ description: 'Cost price' })
  @Prop({ required: true, min: 0 })
  costPrice: number;

  @ApiProperty({ description: 'Currency code' })
  @Prop({ required: true, default: 'PKR' })
  currency: string;

  @ApiProperty({ description: 'Tax class ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'TaxClass' })
  taxClassId?: string;

  @ApiProperty({ description: 'Valid from date' })
  @Prop({ default: Date.now })
  validFrom: Date;

  @ApiProperty({ description: 'Valid to date' })
  @Prop()
  validTo?: Date;

  @ApiProperty({ description: 'Is this pricing active' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export const ProductPricingSchema = SchemaFactory.createForClass(ProductPricing);

// Indexes
ProductPricingSchema.index({ productId: 1, isActive: 1 });
ProductPricingSchema.index({ productId: 1, validFrom: -1 });
ProductPricingSchema.index({ validFrom: 1, validTo: 1 });
ProductPricingSchema.index({ createdAt: -1 });

