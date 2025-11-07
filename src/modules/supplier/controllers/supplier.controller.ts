import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SupplierService } from '../services/supplier.service';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';

@ApiTags('Suppliers')
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  create(@Body() dto: CreateSupplierDto) {
    return this.supplierService.create(dto);
  }

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.supplierService.findAll({ page: Number(page), limit: Number(limit) });
  }

  @Get('active')
  findActive() {
    return this.supplierService.findActiveSuppliers();
  }

  @Get('stats')
  getStats() {
    return this.supplierService.getSupplierStats();
  }

  @Get('search')
  search(@Query('q') searchTerm: string) {
    return this.supplierService.searchSuppliers(searchTerm);
  }

  @Get('rating/:minRating')
  findByRating(@Param('minRating') minRating: number) {
    return this.supplierService.findByRating(minRating);
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.supplierService.findByCode(code);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplierService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSupplierDto) {
    return this.supplierService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supplierService.delete(id);
  }
}