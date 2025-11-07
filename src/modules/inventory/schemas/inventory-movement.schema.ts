import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type InventoryMovementDocument = InventoryMovement & Document;

export enum MovementType {
  PURCHASE = 'purchase',
  SALE = 'sale',
  RETURN = 'return',
  ADJUSTMENT = 'adjustment',
  TRANSFER = 'transfer',
  DAMAGE = 'damage',
  LOSS = 'loss',
  RESTOCK = 'restock',
}

@Schema({ timestamps: true })
export class InventoryMovement {
  @ApiProperty({ description: 'Movement ID' })
  _id: string;

  @ApiProperty({ description: 'Inventory ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Inventory' })
  inventoryId: string;

  @ApiProperty({ enum: MovementType, description: 'Movement type' })
  @Prop({ required: true, enum: MovementType })
  type: MovementType;

  @ApiProperty({ description: 'Quantity moved' })
  @Prop({ required: true })
  quantity: number;

  @ApiProperty({ description: 'Previous stock level' })
  @Prop({ required: true, min: 0 })
  previousStock: number;

  @ApiProperty({ description: 'New stock level' })
  @Prop({ required: true, min: 0 })
  newStock: number;

  @ApiProperty({ description: 'Reference ID (order, purchase order, etc.)' })
  @Prop()
  referenceId?: string;

  @ApiProperty({ description: 'Reference type' })
  @Prop()
  referenceType?: string;

  @ApiProperty({ description: 'Movement notes' })
  @Prop()
  notes?: string;

  @ApiProperty({ description: 'User who made the movement' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId?: string;

  @ApiProperty({ description: 'Cost per unit' })
  @Prop({ min: 0 })
  unitCost?: number;

  @ApiProperty({ description: 'Total cost' })
  @Prop({ min: 0 })
  totalCost?: number;

  @ApiProperty({ description: 'Movement date' })
  @Prop({ default: Date.now })
  movementDate: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const InventoryMovementSchema = SchemaFactory.createForClass(InventoryMovement);

InventoryMovementSchema.index({ inventoryId: 1, movementDate: -1 });
InventoryMovementSchema.index({ type: 1 });
InventoryMovementSchema.index({ referenceId: 1, referenceType: 1 });