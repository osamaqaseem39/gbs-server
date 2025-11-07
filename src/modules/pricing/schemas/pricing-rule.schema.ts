import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PricingRuleDocument = PricingRule & Document;

export enum PricingRuleType {
  BULK_DISCOUNT = 'bulk_discount',
  CUSTOMER_GROUP = 'customer_group',
  SEASONAL = 'seasonal',
  PRODUCT_CATEGORY = 'product_category',
  BRAND = 'brand',
  QUANTITY_BREAK = 'quantity_break',
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  FREE_SHIPPING = 'free_shipping',
}

@Schema({ timestamps: true })
export class PricingRule {
  @ApiProperty({ description: 'Pricing rule ID' })
  _id: string;

  @ApiProperty({ description: 'Rule name' })
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty({ description: 'Rule description' })
  @Prop()
  description?: string;

  @ApiProperty({ enum: PricingRuleType, description: 'Rule type' })
  @Prop({ required: true, enum: PricingRuleType })
  type: PricingRuleType;

  @ApiProperty({ enum: DiscountType, description: 'Discount type' })
  @Prop({ required: true, enum: DiscountType })
  discountType: DiscountType;

  @ApiProperty({ description: 'Discount value' })
  @Prop({ required: true, min: 0 })
  discountValue: number;

  @ApiProperty({ description: 'Minimum quantity' })
  @Prop({ min: 1 })
  minQuantity?: number;

  @ApiProperty({ description: 'Maximum quantity' })
  @Prop({ min: 1 })
  maxQuantity?: number;

  @ApiProperty({ description: 'Minimum order amount' })
  @Prop({ min: 0 })
  minOrderAmount?: number;

  @ApiProperty({ description: 'Maximum order amount' })
  @Prop({ min: 0 })
  maxOrderAmount?: number;

  @ApiProperty({ description: 'Applicable products' })
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Product' })
  productIds?: string[];

  @ApiProperty({ description: 'Applicable categories' })
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Category' })
  categoryIds?: string[];

  @ApiProperty({ description: 'Applicable brands' })
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Brand' })
  brandIds?: string[];

  @ApiProperty({ description: 'Applicable customer groups' })
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'CustomerGroup' })
  customerGroupIds?: string[];

  @ApiProperty({ description: 'Valid from date' })
  @Prop()
  validFrom?: Date;

  @ApiProperty({ description: 'Valid to date' })
  @Prop()
  validTo?: Date;

  @ApiProperty({ description: 'Priority (higher number = higher priority)' })
  @Prop({ default: 0 })
  priority: number;

  @ApiProperty({ description: 'Is active' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Usage limit per customer' })
  @Prop({ min: 1 })
  usageLimitPerCustomer?: number;

  @ApiProperty({ description: 'Total usage limit' })
  @Prop({ min: 1 })
  totalUsageLimit?: number;

  @ApiProperty({ description: 'Current usage count' })
  @Prop({ min: 0, default: 0 })
  usageCount: number;

  @ApiProperty({ description: 'Created by user' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const PricingRuleSchema = SchemaFactory.createForClass(PricingRule);

PricingRuleSchema.index({ type: 1, isActive: 1 });
PricingRuleSchema.index({ validFrom: 1, validTo: 1 });
PricingRuleSchema.index({ priority: -1 });
PricingRuleSchema.index({ productIds: 1 });
PricingRuleSchema.index({ categoryIds: 1 });