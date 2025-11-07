import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductKindService } from '../services/product-kind.service';
import { CreateProductKindDto } from '../dto/create-product-kind.dto';
import { UpdateProductKindDto } from '../dto/update-product-kind.dto';

@ApiTags('ProductKinds')
@Controller('product-kinds')
export class ProductKindController {
  constructor(private readonly productKindService: ProductKindService) {}

  @Post()
  create(@Body() dto: CreateProductKindDto) {
    return this.productKindService.create(dto);
  }

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.productKindService.findAll({ page: Number(page), limit: Number(limit) });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productKindService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductKindDto) {
    return this.productKindService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productKindService.delete(id);
  }
}

