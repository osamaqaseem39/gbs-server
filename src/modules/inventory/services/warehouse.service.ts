import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../../common/services/base.service';
import { Warehouse } from '../schemas/warehouse.schema';
import { WarehouseRepository } from '../repositories/warehouse.repository';

@Injectable()
export class WarehouseService extends BaseService<Warehouse> {
  constructor(private readonly warehouseRepository: WarehouseRepository) {
    super(warehouseRepository);
  }

  async findByCode(code: string): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.findByCode(code);
    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }
    return warehouse;
  }

  async findPrimaryWarehouse(): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.findPrimaryWarehouse();
    if (!warehouse) {
      throw new NotFoundException('Primary warehouse not found');
    }
    return warehouse;
  }

  async findActiveWarehouses(): Promise<Warehouse[]> {
    return this.warehouseRepository.findActiveWarehouses();
  }

  async updateUtilization(warehouseId: string, utilization: number): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.updateUtilization(warehouseId, utilization);
    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }
    return warehouse;
  }

  async setPrimaryWarehouse(warehouseId: string): Promise<Warehouse> {
    // First, unset all primary warehouses
    const warehousesWithPrimary = await this.warehouseRepository.findAll();
    await Promise.all(
      warehousesWithPrimary.data.map(warehouse => 
        this.warehouseRepository.update(warehouse._id, { isPrimary: false })
      )
    );
    
    // Then set the new primary warehouse
    const warehouse = await this.warehouseRepository.update(warehouseId, { isPrimary: true });
    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }
    return warehouse;
  }
}