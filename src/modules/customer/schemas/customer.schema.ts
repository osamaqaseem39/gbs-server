import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true })
export class Customer {
  @ApiProperty({ description: 'Customer ID' })
  _id: string;

  @ApiProperty({ description: 'User ID (reference to User entity)' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User', unique: true })
  userId: string;

  @ApiProperty({ description: 'Loyalty points' })
  @Prop({ default: 0, min: 0 })
  loyaltyPoints: number;

  @ApiProperty({ description: 'Preferred currency' })
  @Prop({ default: 'PKR' })
  preferredCurrency: string;

  @ApiProperty({ description: 'Preferred language' })
  @Prop({ default: 'en' })
  preferredLanguage: string;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

// Indexes
CustomerSchema.index({ userId: 1 });
CustomerSchema.index({ createdAt: -1 }); 