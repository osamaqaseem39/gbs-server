import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { Inventory, InventoryDocument } from '../schemas/inventory.schema';

@Injectable()
export class InventoryRepository extends BaseRepository<InventoryDocument> {
  constructor(
    @InjectModel(Inventory.name) private readonly inventoryModel: Model<InventoryDocument>,
  ) {
    super(inventoryModel);
  }

  async findByProductId(productId: string): Promise<InventoryDocument[]> {
    return this.inventoryModel.find({ productId }).exec();
  }

  async findByWarehouseId(warehouseId: string): Promise<InventoryDocument[]> {
    return this.inventoryModel.find({ warehouseId }).exec();
  }

  async findByProductAndWarehouse(productId: string, warehouseId: string): Promise<InventoryDocument | null> {
    return this.inventoryModel.findOne({ productId, warehouseId }).exec();
  }

  async findLowStockItems(threshold: number = 10): Promise<InventoryDocument[]> {
    return this.inventoryModel.find({ 
      currentStock: { $lte: threshold },
      status: { $ne: 'discontinued' }
    }).exec();
  }

  async updateStock(inventoryId: string, quantity: number, operation: 'add' | 'subtract'): Promise<InventoryDocument | null> {
    const update = operation === 'add' 
      ? { $inc: { currentStock: quantity } }
      : { $inc: { currentStock: -quantity } };
    
    return this.inventoryModel.findByIdAndUpdate(inventoryId, update, { new: true }).exec();
  }

  async reserveStock(inventoryId: string, quantity: number): Promise<InventoryDocument | null> {
    return this.inventoryModel.findByIdAndUpdate(
      inventoryId,
      { 
        $inc: { 
          reservedStock: quantity,
          availableStock: -quantity 
        } 
      },
      { new: true }
    ).exec();
  }

  async releaseReservedStock(inventoryId: string, quantity: number): Promise<InventoryDocument | null> {
    return this.inventoryModel.findByIdAndUpdate(
      inventoryId,
      { 
        $inc: { 
          reservedStock: -quantity,
          availableStock: quantity 
        } 
      },
      { new: true }
    ).exec();
  }
}