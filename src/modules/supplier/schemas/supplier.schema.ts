import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type SupplierDocument = Supplier & Document;

@Schema({ timestamps: true })
export class Supplier {
  @ApiProperty({ description: 'Supplier ID' })
  _id: string;

  @ApiProperty({ description: 'Supplier name' })
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty({ description: 'Supplier code' })
  @Prop({ required: true, unique: true, trim: true })
  code: string;

  @ApiProperty({ description: 'Contact person' })
  @Prop()
  contactPerson?: string;

  @ApiProperty({ description: 'Email address' })
  @Prop()
  email?: string;

  @ApiProperty({ description: 'Phone number' })
  @Prop()
  phone?: string;

  @ApiProperty({ description: 'Website' })
  @Prop()
  website?: string;

  @ApiProperty({ description: 'Address' })
  @Prop({
    type: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
  })
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };

  @ApiProperty({ description: 'Payment terms' })
  @Prop()
  paymentTerms?: string;

  @ApiProperty({ description: 'Credit limit' })
  @Prop({ min: 0 })
  creditLimit?: number;

  @ApiProperty({ description: 'Currency' })
  @Prop({ default: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Tax ID' })
  @Prop()
  taxId?: string;

  @ApiProperty({ description: 'Notes' })
  @Prop()
  notes?: string;

  @ApiProperty({ description: 'Is active' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Rating (1-5)' })
  @Prop({ min: 1, max: 5 })
  rating?: number;

  @ApiProperty({ description: 'Lead time in days' })
  @Prop({ min: 0 })
  leadTime?: number;

  @ApiProperty({ description: 'Minimum order amount' })
  @Prop({ min: 0 })
  minimumOrderAmount?: number;

  createdAt: Date;
  updatedAt: Date;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);

SupplierSchema.index({ code: 1 }, { unique: true });
SupplierSchema.index({ name: 1 });
SupplierSchema.index({ isActive: 1 });