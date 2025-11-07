import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PricingRuleService } from '../services/pricing-rule.service';
import { CreatePricingRuleDto } from '../dto/create-pricing-rule.dto';
import { UpdatePricingRuleDto } from '../dto/update-pricing-rule.dto';

@ApiTags('Pricing Rules')
@Controller('pricing-rules')
export class PricingRuleController {
  constructor(private readonly pricingRuleService: PricingRuleService) {}

  @Post()
  create(@Body() dto: CreatePricingRuleDto) {
    const pricingRuleData = {
      ...dto,
      validFrom: dto.validFrom ? new Date(dto.validFrom) : undefined,
      validTo: dto.validTo ? new Date(dto.validTo) : undefined
    };
    return this.pricingRuleService.create(pricingRuleData);
  }

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.pricingRuleService.findAll({ page: Number(page), limit: Number(limit) });
  }

  @Get('active')
  findActive() {
    return this.pricingRuleService.findActiveRules();
  }

  @Get('stats')
  getStats() {
    return this.pricingRuleService.getRuleStats();
  }

  @Get('type/:type')
  findByType(@Param('type') type: string) {
    return this.pricingRuleService.findByType(type as any);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.pricingRuleService.findByProductId(productId);
  }

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.pricingRuleService.findByCategoryId(categoryId);
  }

  @Get('brand/:brandId')
  findByBrand(@Param('brandId') brandId: string) {
    return this.pricingRuleService.findByBrandId(brandId);
  }

  @Get('customer-group/:customerGroupId')
  findByCustomerGroup(@Param('customerGroupId') customerGroupId: string) {
    return this.pricingRuleService.findByCustomerGroupId(customerGroupId);
  }

  @Get('applicable')
  findApplicable(
    @Query('productIds') productIds?: string,
    @Query('categoryIds') categoryIds?: string,
    @Query('brandIds') brandIds?: string,
    @Query('customerGroupIds') customerGroupIds?: string,
    @Query('quantity') quantity?: number,
    @Query('orderAmount') orderAmount?: number,
  ) {
    return this.pricingRuleService.findApplicableRules(
      productIds?.split(','),
      categoryIds?.split(','),
      brandIds?.split(','),
      customerGroupIds?.split(','),
      quantity,
      orderAmount,
    );
  }

  @Post('calculate-discount')
  calculateDiscount(@Body() body: {
    productIds: string[];
    categoryIds: string[];
    brandIds: string[];
    customerGroupIds: string[];
    quantity: number;
    orderAmount: number;
  }) {
    return this.pricingRuleService.calculateDiscount(
      body.productIds,
      body.categoryIds,
      body.brandIds,
      body.customerGroupIds,
      body.quantity,
      body.orderAmount,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pricingRuleService.findById(id);
  }

  @Get(':id/validate')
  validateRule(@Param('id') id: string) {
    return this.pricingRuleService.validateRule(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePricingRuleDto) {
    const pricingRuleData = {
      ...dto,
      validFrom: dto.validFrom ? new Date(dto.validFrom) : undefined,
      validTo: dto.validTo ? new Date(dto.validTo) : undefined
    };
    return this.pricingRuleService.update(id, pricingRuleData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pricingRuleService.delete(id);
  }
}