import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupplierController } from './controllers/supplier.controller';
import { PurchaseOrderController } from './controllers/purchase-order.controller';
import { SupplierService } from './services/supplier.service';
import { PurchaseOrderService } from './services/purchase-order.service';
import { SupplierRepository } from './repositories/supplier.repository';
import { PurchaseOrderRepository } from './repositories/purchase-order.repository';
import { Supplier, SupplierSchema } from './schemas/supplier.schema';
import { PurchaseOrder, PurchaseOrderSchema } from './schemas/purchase-order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Supplier.name, schema: SupplierSchema },
      { name: PurchaseOrder.name, schema: PurchaseOrderSchema },
    ]),
  ],
  controllers: [SupplierController, PurchaseOrderController],
  providers: [
    SupplierService,
    PurchaseOrderService,
    SupplierRepository,
    PurchaseOrderRepository,
  ],
  exports: [
    SupplierService,
    PurchaseOrderService,
    SupplierRepository,
    PurchaseOrderRepository,
  ],
})
export class SupplierModule {}