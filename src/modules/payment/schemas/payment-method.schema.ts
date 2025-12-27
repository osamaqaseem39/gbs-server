import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PaymentMethodDocument = PaymentMethod & Document;

@Schema({ timestamps: true })
export class PaymentMethod {
  @ApiProperty({ description: 'Payment method ID' })
  _id: string;

  @ApiProperty({ description: 'Payment method code (unique)' })
  @Prop({ required: true, unique: true, trim: true })
  code: string; // e.g., 'credit_card', 'cash_on_delivery', 'bank_transfer'

  @ApiProperty({ description: 'Payment method name' })
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty({ description: 'Payment method description' })
  @Prop()
  description?: string;

  @ApiProperty({ description: 'Is payment method active' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Requires payment gateway' })
  @Prop({ default: false })
  requiresGateway: boolean;

  @ApiProperty({ description: 'Gateway configuration' })
  @Prop({ type: Object })
  gatewayConfig?: Record<string, any>;

  @ApiProperty({ description: 'Sort order' })
  @Prop({ default: 0 })
  sortOrder: number;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export const PaymentMethodSchema = SchemaFactory.createForClass(PaymentMethod);

// Indexes
PaymentMethodSchema.index({ code: 1 });
PaymentMethodSchema.index({ isActive: 1 });
PaymentMethodSchema.index({ sortOrder: 1 });
PaymentMethodSchema.index({ createdAt: -1 });

