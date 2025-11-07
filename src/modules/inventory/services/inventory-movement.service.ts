import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../common/services/base.service';
import { InventoryMovement } from '../schemas/inventory-movement.schema';
import { InventoryMovementRepository } from '../repositories/inventory-movement.repository';

@Injectable()
export class InventoryMovementService extends BaseService<InventoryMovement> {
  constructor(private readonly inventoryMovementRepository: InventoryMovementRepository) {
    super(inventoryMovementRepository);
  }

  async findByInventoryId(inventoryId: string): Promise<InventoryMovement[]> {
    return this.inventoryMovementRepository.findByInventoryId(inventoryId);
  }

  async findByReference(referenceId: string, referenceType: string): Promise<InventoryMovement[]> {
    return this.inventoryMovementRepository.findByReference(referenceId, referenceType);
  }

  async getMovementHistory(inventoryId: string, limit: number = 50): Promise<InventoryMovement[]> {
    return this.inventoryMovementRepository.findByInventoryId(inventoryId, limit);
  }

  async getMovementSummary(inventoryId: string, startDate?: Date, endDate?: Date): Promise<any> {
    const movements = await this.inventoryMovementRepository.findByInventoryId(inventoryId);
    
    let filteredMovements = movements;
    if (startDate && endDate) {
      filteredMovements = movements.filter(movement => 
        movement.movementDate >= startDate && movement.movementDate <= endDate
      );
    }

    const summary = {
      totalMovements: filteredMovements.length,
      totalIn: filteredMovements
        .filter(m => ['purchase', 'return', 'restock'].includes(m.type))
        .reduce((sum, m) => sum + m.quantity, 0),
      totalOut: filteredMovements
        .filter(m => ['sale', 'damage', 'loss'].includes(m.type))
        .reduce((sum, m) => sum + m.quantity, 0),
      totalCost: filteredMovements.reduce((sum, m) => sum + (m.totalCost || 0), 0),
      movementsByType: filteredMovements.reduce((acc, movement) => {
        acc[movement.type] = (acc[movement.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    return summary;
  }
}