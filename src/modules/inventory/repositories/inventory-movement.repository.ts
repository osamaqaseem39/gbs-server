import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { InventoryMovement, InventoryMovementDocument } from '../schemas/inventory-movement.schema';

@Injectable()
export class InventoryMovementRepository extends BaseRepository<InventoryMovementDocument> {
  constructor(
    @InjectModel(InventoryMovement.name) private readonly inventoryMovementModel: Model<InventoryMovementDocument>,
  ) {
    super(inventoryMovementModel);
  }

  async findByInventoryId(inventoryId: string, limit?: number): Promise<InventoryMovementDocument[]> {
    const query = this.inventoryMovementModel
      .find({ inventoryId })
      .sort({ movementDate: -1 });
    
    if (limit) {
      query.limit(limit);
    }
    
    return query.exec();
  }

  async findByReference(referenceId: string, referenceType: string): Promise<InventoryMovementDocument[]> {
    return this.inventoryMovementModel
      .find({ referenceId, referenceType })
      .sort({ movementDate: -1 })
      .exec();
  }

  async findByType(type: string, limit?: number): Promise<InventoryMovementDocument[]> {
    const query = this.inventoryMovementModel
      .find({ type })
      .sort({ movementDate: -1 });
    
    if (limit) {
      query.limit(limit);
    }
    
    return query.exec();
  }

  async getMovementsByDateRange(startDate: Date, endDate: Date): Promise<InventoryMovementDocument[]> {
    return this.inventoryMovementModel
      .find({
        movementDate: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ movementDate: -1 })
      .exec();
  }

  async getTotalMovementsByType(type: string, startDate?: Date, endDate?: Date): Promise<number> {
    const filter: any = { type };
    
    if (startDate && endDate) {
      filter.movementDate = { $gte: startDate, $lte: endDate };
    }
    
    const result = await this.inventoryMovementModel.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$quantity' } } },
    ]);
    
    return result.length > 0 ? result[0].total : 0;
  }
}