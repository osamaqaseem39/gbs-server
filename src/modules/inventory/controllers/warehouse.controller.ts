import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WarehouseService } from '../services/warehouse.service';
import { CreateWarehouseDto } from '../dto/create-warehouse.dto';
import { UpdateWarehouseDto } from '../dto/update-warehouse.dto';

@ApiTags('Warehouses')
@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  create(@Body() dto: CreateWarehouseDto) {
    return this.warehouseService.create(dto);
  }

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.warehouseService.findAll({ page: Number(page), limit: Number(limit) });
  }

  @Get('active')
  findActive() {
    return this.warehouseService.findActiveWarehouses();
  }

  @Get('primary')
  findPrimary() {
    return this.warehouseService.findPrimaryWarehouse();
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.warehouseService.findByCode(code);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehouseService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWarehouseDto) {
    return this.warehouseService.update(id, dto);
  }

  @Put(':id/utilization')
  updateUtilization(@Param('id') id: string, @Body() body: { utilization: number }) {
    return this.warehouseService.updateUtilization(id, body.utilization);
  }

  @Put(':id/set-primary')
  setPrimary(@Param('id') id: string) {
    return this.warehouseService.setPrimaryWarehouse(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warehouseService.delete(id);
  }
}