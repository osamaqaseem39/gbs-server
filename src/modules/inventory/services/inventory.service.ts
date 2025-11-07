import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BaseService } from '../../../common/services/base.service';
import { Inventory } from '../schemas/inventory.schema';
import { InventoryRepository } from '../repositories/inventory.repository';
import { InventoryMovementService } from './inventory-movement.service';
import { MovementType } from '../schemas/inventory-movement.schema';

@Injectable()
export class InventoryService extends BaseService<Inventory> {
  constructor(
    private readonly inventoryRepository: InventoryRepository,
    private readonly inventoryMovementService: InventoryMovementService,
  ) {
    super(inventoryRepository);
  }

  async findByProductId(productId: string): Promise<Inventory[]> {
    return this.inventoryRepository.findByProductId(productId);
  }

  async findByWarehouseId(warehouseId: string): Promise<Inventory[]> {
    return this.inventoryRepository.findByWarehouseId(warehouseId);
  }

  async findByProductAndWarehouse(productId: string, warehouseId: string): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findByProductAndWarehouse(productId, warehouseId);
    if (!inventory) {
      throw new NotFoundException('Inventory record not found for this product and warehouse');
    }
    return inventory;
  }

  async findLowStockItems(threshold: number = 10): Promise<Inventory[]> {
    return this.inventoryRepository.findLowStockItems(threshold);
  }

  async updateStock(
    inventoryId: string, 
    quantity: number, 
    operation: 'add' | 'subtract',
    referenceId?: string,
    referenceType?: string,
    notes?: string,
    userId?: string
  ): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findById(inventoryId);
    if (!inventory) {
      throw new NotFoundException('Inventory record not found');
    }

    const previousStock = inventory.currentStock;
    let newStock: number;

    if (operation === 'add') {
      newStock = previousStock + quantity;
    } else {
      if (previousStock < quantity) {
        throw new BadRequestException('Insufficient stock for this operation');
      }
      newStock = previousStock - quantity;
    }

    const updatedInventory = await this.inventoryRepository.updateStock(inventoryId, quantity, operation);
    
    // Create movement record
    await this.inventoryMovementService.create({
      inventoryId,
      type: operation === 'add' ? MovementType.RESTOCK : MovementType.SALE,
      quantity,
      previousStock,
      newStock,
      referenceId,
      referenceType,
      notes,
      userId,
    });

    return updatedInventory!;
  }

  async reserveStock(inventoryId: string, quantity: number): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findById(inventoryId);
    if (!inventory) {
      throw new NotFoundException('Inventory record not found');
    }

    if (inventory.availableStock < quantity) {
      throw new BadRequestException('Insufficient available stock for reservation');
    }

    return this.inventoryRepository.reserveStock(inventoryId, quantity);
  }

  async releaseReservedStock(inventoryId: string, quantity: number): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findById(inventoryId);
    if (!inventory) {
      throw new NotFoundException('Inventory record not found');
    }

    if (inventory.reservedStock < quantity) {
      throw new BadRequestException('Insufficient reserved stock to release');
    }

    return this.inventoryRepository.releaseReservedStock(inventoryId, quantity);
  }

  async getInventorySummary(): Promise<any> {
    const totalItems = await this.inventoryRepository.findAll();
    const lowStockItems = await this.findLowStockItems();
    const outOfStockItems = totalItems.data.filter(item => item.currentStock === 0);
    
    return {
      totalItems: totalItems.data.length,
      lowStockItems: lowStockItems.length,
      outOfStockItems: outOfStockItems.length,
      totalValue: totalItems.data.reduce((sum, item) => sum + (item.costPrice || 0) * item.currentStock, 0),
    };
  }
}