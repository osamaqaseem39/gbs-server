import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PaymentDocument = Payment & Document;

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Schema({ timestamps: true })
export class Payment {
  @ApiProperty({ description: 'Payment ID' })
  _id: string;

  @ApiProperty({ description: 'Order ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Order' })
  orderId: string;

  @ApiProperty({ description: 'Payment method ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'PaymentMethod' })
  paymentMethodId: string;

  // Amounts
  @ApiProperty({ description: 'Payment amount' })
  @Prop({ required: true, min: 0 })
  amount: number;

  @ApiProperty({ description: 'Currency' })
  @Prop({ default: 'PKR' })
  currency: string;

  @ApiProperty({ description: 'Gateway fee' })
  @Prop({ min: 0 })
  gatewayFee?: number;

  @ApiProperty({ description: 'Net amount (amount - gatewayFee)' })
  @Prop({ min: 0 })
  netAmount: number;

  // Transaction details
  @ApiProperty({ description: 'Transaction ID' })
  @Prop()
  transactionId?: string;

  @ApiProperty({ description: 'Gateway transaction ID' })
  @Prop()
  gatewayTransactionId?: string;

  @ApiProperty({ description: 'Gateway response' })
  @Prop({ type: Object })
  gatewayResponse?: Record<string, any>;

  // Status
  @ApiProperty({ enum: PaymentStatus, description: 'Payment status' })
  @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  // Refund tracking
  @ApiProperty({ description: 'Refund amount' })
  @Prop({ default: 0, min: 0 })
  refundAmount: number;

  @ApiProperty({ description: 'Refund reason' })
  @Prop()
  refundReason?: string;

  @ApiProperty({ description: 'Refunded at timestamp' })
  @Prop()
  refundedAt?: Date;

  // Dates
  @ApiProperty({ description: 'Paid at timestamp' })
  @Prop()
  paidAt?: Date;

  @ApiProperty({ description: 'Failed at timestamp' })
  @Prop()
  failedAt?: Date;

  @ApiProperty({ description: 'Failure reason' })
  @Prop()
  failureReason?: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

// Indexes
PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ paymentMethodId: 1, status: 1 });
PaymentSchema.index({ transactionId: 1 });
PaymentSchema.index({ gatewayTransactionId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ createdAt: -1 }); 