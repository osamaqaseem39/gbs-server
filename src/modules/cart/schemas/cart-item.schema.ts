import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CartItemDocument = CartItem & Document;

@Schema({ timestamps: true })
export class CartItem {
  @ApiProperty({ description: 'Cart item ID' })
  _id: string;

  @ApiProperty({ description: 'Cart ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Cart' })
  cartId: string;

  @ApiProperty({ description: 'Product ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  productId: string;

  @ApiProperty({ description: 'Product variation ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ProductVariation' })
  variationId?: string;

  @ApiProperty({ description: 'Quantity' })
  @Prop({ required: true, min: 1 })
  quantity: number;

  @ApiProperty({ description: 'Price per unit (snapshot at time of add)' })
  @Prop({ required: true, min: 0 })
  price: number;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

// Indexes
CartItemSchema.index({ cartId: 1 });
CartItemSchema.index({ productId: 1 });
CartItemSchema.index({ cartId: 1, productId: 1, variationId: 1 }, { unique: true });

