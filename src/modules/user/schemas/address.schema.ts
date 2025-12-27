import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type AddressDocument = Address & Document;

@Schema({ timestamps: true })
export class Address {
  @ApiProperty({ description: 'Address ID' })
  _id: string;

  @ApiProperty({ description: 'User ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: string;

  @ApiProperty({ enum: ['billing', 'shipping', 'both'], description: 'Address type' })
  @Prop({ required: true, enum: ['billing', 'shipping', 'both'] })
  addressType: 'billing' | 'shipping' | 'both';

  @ApiProperty({ description: 'Address label (e.g., Home, Work, Office)' })
  @Prop({ trim: true })
  label?: string;

  @ApiProperty({ description: 'First name' })
  @Prop({ required: true, trim: true })
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  @Prop({ required: true, trim: true })
  lastName: string;

  @ApiProperty({ description: 'Company name' })
  @Prop({ trim: true })
  company?: string;

  @ApiProperty({ description: 'Address line 1' })
  @Prop({ required: true, trim: true })
  addressLine1: string;

  @ApiProperty({ description: 'Address line 2' })
  @Prop({ trim: true })
  addressLine2?: string;

  @ApiProperty({ description: 'City' })
  @Prop({ required: true, trim: true })
  city: string;

  @ApiProperty({ description: 'State/Province' })
  @Prop({ trim: true })
  state?: string;

  @ApiProperty({ description: 'Postal code' })
  @Prop({ required: true, trim: true })
  postalCode: string;

  @ApiProperty({ description: 'Country' })
  @Prop({ required: true, trim: true })
  country: string;

  @ApiProperty({ description: 'Phone number' })
  @Prop({ trim: true })
  phone?: string;

  @ApiProperty({ description: 'Email address' })
  @Prop({ trim: true, lowercase: true })
  email?: string;

  @ApiProperty({ description: 'Is this the default address' })
  @Prop({ default: false })
  isDefault: boolean;

  @ApiProperty({ description: 'Is this address active' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

// Indexes
AddressSchema.index({ userId: 1, addressType: 1 });
AddressSchema.index({ userId: 1, isDefault: 1 });
AddressSchema.index({ userId: 1, isActive: 1 });
AddressSchema.index({ createdAt: -1 });

