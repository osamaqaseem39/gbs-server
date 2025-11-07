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

  @ApiProperty({ description: 'Warehouse code' })
  @Prop({ required: true, unique: true, trim: true })
  code: string;

  @ApiProperty({ description: 'Warehouse description' })
  @Prop()
  description?: string;

  @ApiProperty({ description: 'Address' })
  @Prop({
    type: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
  })
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  @ApiProperty({ description: 'Contact information' })
  @Prop({
    type: {
      phone: String,
      email: String,
      manager: String,
    },
  })
  contact?: {
    phone?: string;
    email?: string;
    manager?: string;
  };

  @ApiProperty({ description: 'Warehouse capacity' })
  @Prop({ min: 0 })
  capacity?: number;

  @ApiProperty({ description: 'Current utilization' })
  @Prop({ min: 0, max: 100, default: 0 })
  utilization: number;

  @ApiProperty({ description: 'Is primary warehouse' })
  @Prop({ default: false })
  isPrimary: boolean;

  @ApiProperty({ description: 'Is active' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Operating hours' })
  @Prop({
    type: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
  })
  operatingHours?: {
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };

  createdAt: Date;
  updatedAt: Date;
}

export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);

WarehouseSchema.index({ code: 1 }, { unique: true });
WarehouseSchema.index({ isPrimary: 1 });
WarehouseSchema.index({ isActive: 1 });