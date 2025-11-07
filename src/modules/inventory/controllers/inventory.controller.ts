import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InventoryService } from '../services/inventory.service';
import { CreateInventoryDto } from '../dto/create-inventory.dto';
import { UpdateInventoryDto } from '../dto/update-inventory.dto';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(@Body() dto: CreateInventoryDto) {
    return this.inventoryService.create(dto);
  }

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.inventoryService.findAll({ page: Number(page), limit: Number(limit) });
  }

  @Get('summary')
  getSummary() {
    return this.inventoryService.getInventorySummary();
  }

  @Get('low-stock')
  getLowStockItems(@Query('threshold') threshold?: number) {
    return this.inventoryService.findLowStockItems(Number(threshold) || 10);
  }

  @Get('product/:productId')
  findByProductId(@Param('productId') productId: string) {
    return this.inventoryService.findByProductId(productId);
  }

  @Get('warehouse/:warehouseId')
  findByWarehouseId(@Param('warehouseId') warehouseId: string) {
    return this.inventoryService.findByWarehouseId(warehouseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInventoryDto) {
    return this.inventoryService.update(id, dto);
  }

  @Post(':id/stock')
  updateStock(
    @Param('id') id: string,
    @Body() body: { quantity: number; operation: 'add' | 'subtract'; referenceId?: string; referenceType?: string; notes?: string; userId?: string }
  ) {
    return this.inventoryService.updateStock(
      id,
      body.quantity,
      body.operation,
      body.referenceId,
      body.referenceType,
      body.notes,
      body.userId
    );
  }

  @Post(':id/reserve')
  reserveStock(@Param('id') id: string, @Body() body: { quantity: number }) {
    return this.inventoryService.reserveStock(id, body.quantity);
  }

  @Post(':id/release')
  releaseReservedStock(@Param('id') id: string, @Body() body: { quantity: number }) {
    return this.inventoryService.releaseReservedStock(id, body.quantity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService.delete(id);
  }
}