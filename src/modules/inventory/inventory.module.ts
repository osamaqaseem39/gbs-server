import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryController } from './controllers/inventory.controller';
import { WarehouseController } from './controllers/warehouse.controller';
import { InventoryService } from './services/inventory.service';
import { WarehouseService } from './services/warehouse.service';
import { InventoryMovementService } from './services/inventory-movement.service';
import { InventoryRepository } from './repositories/inventory.repository';
import { WarehouseRepository } from './repositories/warehouse.repository';
import { InventoryMovementRepository } from './repositories/inventory-movement.repository';
import { Inventory, InventorySchema } from './schemas/inventory.schema';
import { Warehouse, WarehouseSchema } from './schemas/warehouse.schema';
import { InventoryMovement, InventoryMovementSchema } from './schemas/inventory-movement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
      { name: Warehouse.name, schema: WarehouseSchema },
      { name: InventoryMovement.name, schema: InventoryMovementSchema },
    ]),
  ],
  controllers: [InventoryController, WarehouseController],
  providers: [
    InventoryService,
    WarehouseService,
    InventoryMovementService,
    InventoryRepository,
    WarehouseRepository,
    InventoryMovementRepository,
  ],
  exports: [
    InventoryService,
    WarehouseService,
    InventoryMovementService,
    InventoryRepository,
    WarehouseRepository,
    InventoryMovementRepository,
  ],
})
export class InventoryModule {}