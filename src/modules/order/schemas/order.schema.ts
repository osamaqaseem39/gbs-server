import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

@Schema({ timestamps: true })
export class Order {
  @ApiProperty({ description: 'Order ID' })
  _id: string;

  @ApiProperty({ description: 'Order number (human-readable)' })
  @Prop({ required: true, unique: true })
  orderNumber: string; // e.g., "ORD-2024-001234"

  @ApiProperty({ description: 'Customer ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customerId: string;

  // Status
  @ApiProperty({ enum: OrderStatus, description: 'Order status' })
  @Prop({ required: true, enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @ApiProperty({ enum: PaymentStatus, description: 'Payment status' })
  @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.UNPAID })
  paymentStatus: PaymentStatus;

  @ApiProperty({ enum: ['unfulfilled', 'partial', 'fulfilled', 'cancelled'], description: 'Fulfillment status' })
  @Prop({
    enum: ['unfulfilled', 'partial', 'fulfilled', 'cancelled'],
    default: 'unfulfilled',
  })
  fulfillmentStatus: string;

  // Pricing
  @ApiProperty({ description: 'Subtotal' })
  @Prop({ required: true, min: 0 })
  subtotal: number;

  @ApiProperty({ description: 'Discount total' })
  @Prop({ default: 0, min: 0 })
  discountTotal: number;

  @ApiProperty({ description: 'Shipping total' })
  @Prop({ default: 0, min: 0 })
  shippingTotal: number;

  @ApiProperty({ description: 'Tax total' })
  @Prop({ default: 0, min: 0 })
  taxTotal: number;

  @ApiProperty({ description: 'Order total' })
  @Prop({ required: true, min: 0 })
  total: number;

  @ApiProperty({ description: 'Currency' })
  @Prop({ default: 'PKR' })
  currency: string;

  // Addresses (references)
  @ApiProperty({ description: 'Billing address ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Address' })
  billingAddressId: string;

  @ApiProperty({ description: 'Shipping address ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Address' })
  shippingAddressId: string;

  // Shipping
  @ApiProperty({ description: 'Shipping method ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ShippingMethod' })
  shippingMethodId?: string;

  @ApiProperty({ description: 'Tracking number' })
  @Prop()
  trackingNumber?: string;

  @ApiProperty({ description: 'Estimated delivery date' })
  @Prop()
  estimatedDeliveryDate?: Date;

  @ApiProperty({ description: 'Actual delivery date' })
  @Prop()
  actualDeliveryDate?: Date;

  // Payment
  @ApiProperty({ description: 'Payment method ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'PaymentMethod' })
  paymentMethodId?: string;

  // Discount
  @ApiProperty({ description: 'Coupon ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Coupon' })
  couponId?: string;

  // Notes
  @ApiProperty({ description: 'Customer notes' })
  @Prop()
  customerNotes?: string;

  @ApiProperty({ description: 'Admin notes' })
  @Prop()
  adminNotes?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Indexes
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ customerId: 1 });
OrderSchema.index({ status: 1, paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ trackingNumber: 1 }); 