import { IsString, IsOptional, IsEnum, IsArray, IsNumber, IsMongoId, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PricingRuleType, DiscountType } from '../schemas/pricing-rule.schema';

export class CreatePricingRuleDto {
  @ApiProperty({ description: 'Rule name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Rule description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: PricingRuleType, description: 'Rule type' })
  @IsEnum(PricingRuleType)
  type: PricingRuleType;

  @ApiProperty({ enum: DiscountType, description: 'Discount type' })
  @IsEnum(DiscountType)
  discountType: DiscountType;

  @ApiProperty({ description: 'Discount value' })
  @IsNumber()
  @Min(0)
  discountValue: number;

  @ApiPropertyOptional({ description: 'Minimum quantity' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  minQuantity?: number;

  @ApiPropertyOptional({ description: 'Maximum quantity' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxQuantity?: number;

  @ApiPropertyOptional({ description: 'Minimum order amount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderAmount?: number;

  @ApiPropertyOptional({ description: 'Maximum order amount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxOrderAmount?: number;

  @ApiPropertyOptional({ description: 'Applicable products' })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  productIds?: string[];

  @ApiPropertyOptional({ description: 'Applicable categories' })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  categoryIds?: string[];

  @ApiPropertyOptional({ description: 'Applicable brands' })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  brandIds?: string[];

  @ApiPropertyOptional({ description: 'Applicable customer groups' })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  customerGroupIds?: string[];

  @ApiPropertyOptional({ description: 'Valid from date' })
  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @ApiPropertyOptional({ description: 'Valid to date' })
  @IsOptional()
  @IsDateString()
  validTo?: string;

  @ApiPropertyOptional({ description: 'Priority (higher number = higher priority)' })
  @IsOptional()
  @IsNumber()
  priority?: number;

  @ApiPropertyOptional({ description: 'Is active' })
  @IsOptional()
  @IsNumber()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Usage limit per customer' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimitPerCustomer?: number;

  @ApiPropertyOptional({ description: 'Total usage limit' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  totalUsageLimit?: number;

  @ApiPropertyOptional({ description: 'Created by user' })
  @IsOptional()
  @IsMongoId()
  createdBy?: string;
}