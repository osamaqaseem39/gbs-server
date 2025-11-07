import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type GiftServiceDocument = GiftService & Document;

export enum GiftServiceType {
  GIFT_WRAP = 'gift_wrap',
  GIFT_MESSAGE = 'gift_message',
  GIFT_BOX = 'gift_box',
  GIFT_CARD = 'gift_card',
  PERSONALIZATION = 'personalization',
}

@Schema({ timestamps: true })
export class GiftService {
  @ApiProperty({ description: 'Gift service ID' })
  _id: string;

  @ApiProperty({ description: 'Service name' })
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty({ description: 'Service description' })
  @Prop()
  description?: string;

  @ApiProperty({ enum: GiftServiceType, description: 'Service type' })
  @Prop({ required: true, enum: GiftServiceType })
  type: GiftServiceType;

  @ApiProperty({ description: 'Service price' })
  @Prop({ required: true, min: 0 })
  price: number;

  @ApiProperty({ description: 'Currency' })
  @Prop({ default: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Is free' })
  @Prop({ default: false })
  isFree: boolean;

  @ApiProperty({ description: 'Minimum order amount for free service' })
  @Prop({ min: 0 })
  freeThreshold?: number;

  @ApiProperty({ description: 'Available options' })
  @Prop({ type: [String] })
  options?: string[];

  @ApiProperty({ description: 'Maximum characters for messages' })
  @Prop({ min: 0 })
  maxCharacters?: number;

  @ApiProperty({ description: 'Is active' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Sort order' })
  @Prop({ default: 0 })
  sortOrder: number;

  @ApiProperty({ description: 'Image URL' })
  @Prop()
  imageUrl?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const GiftServiceSchema = SchemaFactory.createForClass(GiftService);

GiftServiceSchema.index({ type: 1, isActive: 1 });
GiftServiceSchema.index({ sortOrder: 1 });