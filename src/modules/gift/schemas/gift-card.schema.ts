import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type GiftCardDocument = GiftCard & Document;

export enum GiftCardStatus {
  ACTIVE = 'active',
  USED = 'used',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class GiftCard {
  @ApiProperty({ description: 'Gift card ID' })
  _id: string;

  @ApiProperty({ description: 'Gift card code' })
  @Prop({ required: true, unique: true, trim: true })
  code: string;

  @ApiProperty({ description: 'Original amount' })
  @Prop({ required: true, min: 0 })
  originalAmount: number;

  @ApiProperty({ description: 'Current balance' })
  @Prop({ required: true, min: 0 })
  currentBalance: number;

  @ApiProperty({ description: 'Currency' })
  @Prop({ default: 'USD' })
  currency: string;

  @ApiProperty({ enum: GiftCardStatus, description: 'Card status' })
  @Prop({ required: true, enum: GiftCardStatus, default: GiftCardStatus.ACTIVE })
  status: GiftCardStatus;

  @ApiProperty({ description: 'Purchased by customer' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  purchasedBy?: string;

  @ApiProperty({ description: 'Recipient email' })
  @Prop()
  recipientEmail?: string;

  @ApiProperty({ description: 'Recipient name' })
  @Prop()
  recipientName?: string;

  @ApiProperty({ description: 'Gift message' })
  @Prop()
  giftMessage?: string;

  @ApiProperty({ description: 'Expiry date' })
  @Prop()
  expiryDate?: Date;

  @ApiProperty({ description: 'Used by customer' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  usedBy?: string;

  @ApiProperty({ description: 'Used date' })
  @Prop()
  usedAt?: Date;

  @ApiProperty({ description: 'Order ID where it was used' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order' })
  usedInOrder?: string;

  @ApiProperty({ description: 'Purchase order ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order' })
  purchaseOrderId?: string;

  @ApiProperty({ description: 'Is digital' })
  @Prop({ default: true })
  isDigital: boolean;

  @ApiProperty({ description: 'Delivery method' })
  @Prop()
  deliveryMethod?: string;

  @ApiProperty({ description: 'Notes' })
  @Prop()
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const GiftCardSchema = SchemaFactory.createForClass(GiftCard);

GiftCardSchema.index({ code: 1 }, { unique: true });
GiftCardSchema.index({ status: 1 });
GiftCardSchema.index({ purchasedBy: 1 });
GiftCardSchema.index({ recipientEmail: 1 });
GiftCardSchema.index({ expiryDate: 1 });