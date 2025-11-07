import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GiftServiceService } from '../services/gift-service.service';
import { CreateGiftServiceDto } from '../dto/create-gift-service.dto';
import { UpdateGiftServiceDto } from '../dto/update-gift-service.dto';

@ApiTags('Gift Services')
@Controller('gift-services')
export class GiftServiceController {
  constructor(private readonly giftServiceService: GiftServiceService) {}

  @Post()
  create(@Body() dto: CreateGiftServiceDto) {
    return this.giftServiceService.create(dto);
  }

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.giftServiceService.findAll({ page: Number(page), limit: Number(limit) });
  }

  @Get('active')
  findActive() {
    return this.giftServiceService.findActiveServices();
  }

  @Get('available')
  getAvailable(@Query('orderAmount') orderAmount?: number) {
    return this.giftServiceService.getAvailableServices(Number(orderAmount) || 0);
  }

  @Get('free')
  findFree() {
    return this.giftServiceService.findFreeServices();
  }

  @Get('type/:type')
  findByType(@Param('type') type: string) {
    return this.giftServiceService.findByType(type as any);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.giftServiceService.findById(id);
  }

  @Get(':id/price')
  calculatePrice(@Param('id') id: string, @Query('orderAmount') orderAmount?: number) {
    return this.giftServiceService.calculateServicePrice(id, Number(orderAmount) || 0);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGiftServiceDto) {
    return this.giftServiceService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.giftServiceService.delete(id);
  }
}