import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart {
  @ApiProperty({ description: 'Cart ID' })
  _id: string;

  @ApiProperty({ description: 'Customer ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customerId?: string;

  @ApiProperty({ description: 'Session ID for guest carts' })
  @Prop({ required: true, unique: true })
  sessionId: string;

  @ApiProperty({ description: 'Cart items (references to CartItem collection)' })
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'CartItem', default: [] })
  items: string[];

  @ApiProperty({ description: 'Cart total' })
  @Prop({ required: true, min: 0, default: 0 })
  total: number;

  @ApiProperty({ description: 'Currency' })
  @Prop({ default: 'PKR' })
  currency: string;

  @ApiProperty({ description: 'Coupon ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Coupon' })
  couponId?: string;

  @ApiProperty({ description: 'Cart expiration date' })
  @Prop()
  expiresAt?: Date; // Auto-expire after inactivity

  @ApiProperty({ description: 'Last activity timestamp' })
  @Prop()
  lastActivityAt: Date;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

// Indexes
CartSchema.index({ customerId: 1 });
CartSchema.index({ sessionId: 1 });
CartSchema.index({ expiresAt: 1 }); // For cleanup job
CartSchema.index({ lastActivityAt: 1 });
CartSchema.index({ createdAt: -1 }); 