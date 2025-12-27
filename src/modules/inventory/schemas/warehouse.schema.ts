import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type WarehouseDocument = Warehouse & Document;

@Schema({ timestamps: true })
export class Warehouse {
  @ApiProperty({ description: 'Warehouse ID' })
  _id: string;

  @ApiProperty({ description: 'Warehouse name' })
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty({ description: 'Warehouse code (unique)' })
  @Prop({ required: true, unique: true, trim: true })
  code: string;

  @ApiProperty({ description: 'Warehouse address' })
  @Prop({
    type: {
      addressLine1: { type: String, required: true, trim: true },
      addressLine2: { type: String, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, trim: true },
      postalCode: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
    },
    required: true,
  })
  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };

  @ApiProperty({ description: 'Contact person' })
  @Prop({ trim: true })
  contactPerson?: string;

  @ApiProperty({ description: 'Phone number' })
  @Prop({ trim: true })
  phone?: string;

  @ApiProperty({ description: 'Email address' })
  @Prop({ trim: true, lowercase: true })
  email?: string;

  @ApiProperty({ description: 'Is warehouse active' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Is this the default warehouse' })
  @Prop({ default: false })
  isDefault: boolean;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);

// Indexes
WarehouseSchema.index({ code: 1 });
WarehouseSchema.index({ isActive: 1 });
WarehouseSchema.index({ isDefault: 1 });
WarehouseSchema.index({ createdAt: -1 });

