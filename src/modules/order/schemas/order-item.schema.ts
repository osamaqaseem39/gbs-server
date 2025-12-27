import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type OrderItemDocument = OrderItem & Document;

@Schema({ timestamps: true })
export class OrderItem {
  @ApiProperty({ description: 'Order item ID' })
  _id: string;

  @ApiProperty({ description: 'Order ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Order' })
  orderId: string;

  @ApiProperty({ description: 'Product ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  productId: string;

  @ApiProperty({ description: 'Product variation ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ProductVariation' })
  variationId?: string;

  // Snapshot at time of order
  @ApiProperty({ description: 'Product name (snapshot)' })
  @Prop({ required: true })
  productName: string;

  @ApiProperty({ description: 'Product SKU (snapshot)' })
  @Prop()
  productSku: string;

  @ApiProperty({ description: 'Quantity ordered' })
  @Prop({ required: true, min: 1 })
  quantity: number;

  @ApiProperty({ description: 'Price per unit (snapshot)' })
  @Prop({ required: true, min: 0 })
  unitPrice: number;

  @ApiProperty({ description: 'Discount amount' })
  @Prop({ default: 0, min: 0 })
  discountAmount: number;

  @ApiProperty({ description: 'Tax amount' })
  @Prop({ default: 0, min: 0 })
  taxAmount: number;

  @ApiProperty({ description: 'Subtotal before tax/discount' })
  @Prop({ required: true, min: 0 })
  subtotal: number;

  @ApiProperty({ description: 'Total after tax/discount' })
  @Prop({ required: true, min: 0 })
  total: number;

  // Item status
  @ApiProperty({ enum: ['pending', 'processing', 'shipped', 'delivered', 'returned', 'cancelled'], description: 'Item status' })
  @Prop({
    enum: ['pending', 'processing', 'shipped', 'delivered', 'returned', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

// Indexes
OrderItemSchema.index({ orderId: 1 });
OrderItemSchema.index({ productId: 1, createdAt: -1 });
OrderItemSchema.index({ status: 1 });

