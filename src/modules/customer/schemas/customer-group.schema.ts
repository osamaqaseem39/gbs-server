import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CustomerGroupDocument = CustomerGroup & Document;

@Schema({ timestamps: true })
export class CustomerGroup {
  @ApiProperty({ description: 'Customer group ID' })
  _id: string;

  @ApiProperty({ description: 'Group name' })
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty({ description: 'Group description' })
  @Prop()
  description?: string;

  @ApiProperty({ description: 'Group code' })
  @Prop({ required: true, unique: true, trim: true })
  code: string;

  @ApiProperty({ description: 'Discount percentage' })
  @Prop({ min: 0, max: 100, default: 0 })
  discountPercentage: number;

  @ApiProperty({ description: 'Fixed discount amount' })
  @Prop({ min: 0, default: 0 })
  fixedDiscountAmount: number;

  @ApiProperty({ description: 'Free shipping threshold' })
  @Prop({ min: 0 })
  freeShippingThreshold?: number;

  @ApiProperty({ description: 'Priority level' })
  @Prop({ min: 0, default: 0 })
  priority: number;

  @ApiProperty({ description: 'Is active' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Members count' })
  @Prop({ min: 0, default: 0 })
  membersCount: number;

  @ApiProperty({ description: 'Group criteria' })
  @Prop({
    type: {
      minOrderCount: Number,
      minTotalSpent: Number,
      registrationDateFrom: Date,
      registrationDateTo: Date,
      tags: [String],
    },
  })
  criteria?: {
    minOrderCount?: number;
    minTotalSpent?: number;
    registrationDateFrom?: Date;
    registrationDateTo?: Date;
    tags?: string[];
  };

  @ApiProperty({ description: 'Group color' })
  @Prop()
  color?: string;

  @ApiProperty({ description: 'Group icon' })
  @Prop()
  icon?: string;

  @ApiProperty({ description: 'Special benefits' })
  @Prop({ type: [String] })
  benefits?: string[];

  @ApiProperty({ description: 'Created by user' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const CustomerGroupSchema = SchemaFactory.createForClass(CustomerGroup);

CustomerGroupSchema.index({ code: 1 }, { unique: true });
CustomerGroupSchema.index({ name: 1 });
CustomerGroupSchema.index({ isActive: 1 });
CustomerGroupSchema.index({ priority: -1 });