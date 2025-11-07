import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PurchaseOrderDocument = PurchaseOrder & Document;

export enum PurchaseOrderStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  ORDERED = 'ordered',
  PARTIALLY_RECEIVED = 'partially_received',
  RECEIVED = 'received',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class PurchaseOrderItem {
  @ApiProperty({ description: 'Product ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  productId: string;

  @ApiProperty({ description: 'Product variant ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ProductVariation' })
  variantId?: string;

  @ApiProperty({ description: 'Quantity ordered' })
  @Prop({ required: true, min: 1 })
  quantity: number;

  @ApiProperty({ description: 'Quantity received' })
  @Prop({ min: 0, default: 0 })
  quantityReceived: number;

  @ApiProperty({ description: 'Unit cost' })
  @Prop({ required: true, min: 0 })
  unitCost: number;

  @ApiProperty({ description: 'Total cost' })
  @Prop({ required: true, min: 0 })
  totalCost: number;

  @ApiProperty({ description: 'Expected delivery date' })
  @Prop()
  expectedDeliveryDate?: Date;

  @ApiProperty({ description: 'Notes' })
  @Prop()
  notes?: string;
}

@Schema({ timestamps: true })
export class PurchaseOrder {
  @ApiProperty({ description: 'Purchase order ID' })
  _id: string;

  @ApiProperty({ description: 'Purchase order number' })
  @Prop({ required: true, unique: true, trim: true })
  orderNumber: string;

  @ApiProperty({ description: 'Supplier ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Supplier' })
  supplierId: string;

  @ApiProperty({ enum: PurchaseOrderStatus, description: 'Order status' })
  @Prop({ required: true, enum: PurchaseOrderStatus, default: PurchaseOrderStatus.DRAFT })
  status: PurchaseOrderStatus;

  @ApiProperty({ description: 'Order items' })
  @Prop({ type: [PurchaseOrderItem], required: true })
  items: PurchaseOrderItem[];

  @ApiProperty({ description: 'Subtotal' })
  @Prop({ required: true, min: 0 })
  subtotal: number;

  @ApiProperty({ description: 'Tax amount' })
  @Prop({ min: 0, default: 0 })
  taxAmount: number;

  @ApiProperty({ description: 'Shipping cost' })
  @Prop({ min: 0, default: 0 })
  shippingCost: number;

  @ApiProperty({ description: 'Total amount' })
  @Prop({ required: true, min: 0 })
  totalAmount: number;

  @ApiProperty({ description: 'Currency' })
  @Prop({ default: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Expected delivery date' })
  @Prop()
  expectedDeliveryDate?: Date;

  @ApiProperty({ description: 'Actual delivery date' })
  @Prop()
  actualDeliveryDate?: Date;

  @ApiProperty({ description: 'Order notes' })
  @Prop()
  notes?: string;

  @ApiProperty({ description: 'Created by user' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy?: string;

  @ApiProperty({ description: 'Approved by user' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  approvedBy?: string;

  @ApiProperty({ description: 'Approval date' })
  @Prop()
  approvedAt?: Date;

  @ApiProperty({ description: 'Order date' })
  @Prop()
  orderedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const PurchaseOrderSchema = SchemaFactory.createForClass(PurchaseOrder);

PurchaseOrderSchema.index({ orderNumber: 1 }, { unique: true });
PurchaseOrderSchema.index({ supplierId: 1 });
PurchaseOrderSchema.index({ status: 1 });
PurchaseOrderSchema.index({ createdBy: 1 });