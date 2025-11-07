import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type InventoryDocument = Inventory & Document;

export enum InventoryStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued',
}

@Schema({ timestamps: true })
export class Inventory {
  @ApiProperty({ description: 'Inventory ID' })
  _id: string;

  @ApiProperty({ description: 'Product ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  productId: string;

  @ApiProperty({ description: 'Product variant ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ProductVariation' })
  variantId?: string;

  @ApiProperty({ description: 'Warehouse ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Warehouse' })
  warehouseId: string;

  @ApiProperty({ description: 'Current stock quantity' })
  @Prop({ required: true, min: 0, default: 0 })
  currentStock: number;

  @ApiProperty({ description: 'Reserved stock quantity' })
  @Prop({ min: 0, default: 0 })
  reservedStock: number;

  @ApiProperty({ description: 'Available stock quantity' })
  @Prop({ min: 0, default: 0 })
  availableStock: number;

  @ApiProperty({ description: 'Reorder point' })
  @Prop({ min: 0, default: 0 })
  reorderPoint: number;

  @ApiProperty({ description: 'Reorder quantity' })
  @Prop({ min: 0, default: 0 })
  reorderQuantity: number;

  @ApiProperty({ description: 'Maximum stock level' })
  @Prop({ min: 0 })
  maxStockLevel?: number;

  @ApiProperty({ description: 'Cost price' })
  @Prop({ min: 0 })
  costPrice?: number;

  @ApiProperty({ enum: InventoryStatus, description: 'Inventory status' })
  @Prop({ required: true, enum: InventoryStatus, default: InventoryStatus.OUT_OF_STOCK })
  status: InventoryStatus;

  @ApiProperty({ description: 'Last restocked date' })
  @Prop()
  lastRestockedAt?: Date;

  @ApiProperty({ description: 'Last sold date' })
  @Prop()
  lastSoldAt?: Date;

  @ApiProperty({ description: 'Location within warehouse' })
  @Prop()
  location?: string;

  @ApiProperty({ description: 'Barcode/SKU for scanning' })
  @Prop()
  barcode?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);

InventorySchema.index({ productId: 1, warehouseId: 1 });
InventorySchema.index({ status: 1 });
InventorySchema.index({ currentStock: 1 });