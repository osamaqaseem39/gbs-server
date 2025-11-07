import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type WishlistDocument = Wishlist & Document;

@Schema({ timestamps: true })
export class WishlistItem {
  @ApiProperty({ description: 'Product ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  productId: string;

  @ApiProperty({ description: 'Product variant ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ProductVariation' })
  variantId?: string;

  @ApiProperty({ description: 'Added date' })
  @Prop({ default: Date.now })
  addedAt: Date;

  @ApiProperty({ description: 'Notes' })
  @Prop()
  notes?: string;

  @ApiProperty({ description: 'Priority' })
  @Prop({ min: 1, max: 5, default: 3 })
  priority: number;
}

@Schema({ timestamps: true })
export class Wishlist {
  @ApiProperty({ description: 'Wishlist ID' })
  _id: string;

  @ApiProperty({ description: 'Customer ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customerId: string;

  @ApiProperty({ description: 'Wishlist name' })
  @Prop({ required: true, trim: true, default: 'My Wishlist' })
  name: string;

  @ApiProperty({ description: 'Is default wishlist' })
  @Prop({ default: true })
  isDefault: boolean;

  @ApiProperty({ description: 'Is public' })
  @Prop({ default: false })
  isPublic: boolean;

  @ApiProperty({ description: 'Wishlist items' })
  @Prop({ type: [WishlistItem], default: [] })
  items: WishlistItem[];

  @ApiProperty({ description: 'Items count' })
  @Prop({ min: 0, default: 0 })
  itemsCount: number;

  @ApiProperty({ description: 'Total estimated value' })
  @Prop({ min: 0, default: 0 })
  totalValue: number;

  @ApiProperty({ description: 'Currency' })
  @Prop({ default: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Last updated' })
  @Prop({ default: Date.now })
  lastUpdated: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);

WishlistSchema.index({ customerId: 1, isDefault: 1 });
WishlistSchema.index({ customerId: 1, name: 1 });
WishlistSchema.index({ isPublic: 1 });