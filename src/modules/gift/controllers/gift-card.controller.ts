import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GiftCardService } from '../services/gift-card.service';
import { CreateGiftCardDto } from '../dto/create-gift-card.dto';
import { UpdateGiftCardDto } from '../dto/update-gift-card.dto';

@ApiTags('Gift Cards')
@Controller('gift-cards')
export class GiftCardController {
  constructor(private readonly giftCardService: GiftCardService) {}

  @Post()
  create(@Body() dto: CreateGiftCardDto) {
    const giftCardData = {
      ...dto,
      expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined
    };
    return this.giftCardService.create(giftCardData);
  }

  @Post('generate-code')
  generateCode() {
    return this.giftCardService.generateGiftCardCode();
  }

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.giftCardService.findAll({ page: Number(page), limit: Number(limit) });
  }

  @Get('stats')
  getStats() {
    return this.giftCardService.getGiftCardStats();
  }

  @Get('active')
  findActive() {
    return this.giftCardService.findActiveCards();
  }

  @Get('expired')
  findExpired() {
    return this.giftCardService.findExpiredCards();
  }

  @Get('used')
  findUsed() {
    return this.giftCardService.findUsedCards();
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: string) {
    return this.giftCardService.findByStatus(status as any);
  }

  @Get('purchased-by/:customerId')
  findByPurchasedBy(@Param('customerId') customerId: string) {
    return this.giftCardService.findByPurchasedBy(customerId);
  }

  @Get('recipient/:email')
  findByRecipientEmail(@Param('email') email: string) {
    return this.giftCardService.findByRecipientEmail(email);
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.giftCardService.findByCode(code);
  }

  @Get('code/:code/validate')
  validateGiftCard(@Param('code') code: string) {
    return this.giftCardService.validateGiftCard(code);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.giftCardService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGiftCardDto) {
    const giftCardData = {
      ...dto,
      expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined
    };
    return this.giftCardService.update(id, giftCardData);
  }

  @Put('code/:code/use')
  useGiftCard(
    @Param('code') code: string,
    @Body() body: { usedBy: string; orderId: string; amount: number }
  ) {
    return this.giftCardService.useGiftCard(code, body.usedBy, body.orderId, body.amount);
  }

  @Put('code/:code/refund')
  refundGiftCard(@Param('code') code: string, @Body() body: { amount: number }) {
    return this.giftCardService.refundGiftCard(code, body.amount);
  }

  @Put('code/:code/expire')
  expireGiftCard(@Param('code') code: string) {
    return this.giftCardService.expireGiftCard(code);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.giftCardService.delete(id);
  }
}