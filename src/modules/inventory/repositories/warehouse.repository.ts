import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { Warehouse, WarehouseDocument } from '../schemas/warehouse.schema';

@Injectable()
export class WarehouseRepository extends BaseRepository<WarehouseDocument> {
  constructor(
    @InjectModel(Warehouse.name) private readonly warehouseModel: Model<WarehouseDocument>,
  ) {
    super(warehouseModel);
  }

  async findByCode(code: string): Promise<WarehouseDocument | null> {
    return this.warehouseModel.findOne({ code }).exec();
  }

  async findPrimaryWarehouse(): Promise<WarehouseDocument | null> {
    return this.warehouseModel.findOne({ isPrimary: true, isActive: true }).exec();
  }

  async findActiveWarehouses(): Promise<WarehouseDocument[]> {
    return this.warehouseModel.find({ isActive: true }).sort({ name: 1 }).exec();
  }

  async updateUtilization(warehouseId: string, utilization: number): Promise<WarehouseDocument | null> {
    return this.warehouseModel.findByIdAndUpdate(
      warehouseId,
      { utilization: Math.max(0, Math.min(100, utilization)) },
      { new: true }
    ).exec();
  }
}