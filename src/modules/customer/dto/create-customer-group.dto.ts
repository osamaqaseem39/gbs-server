import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsObject, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class GroupCriteriaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  minTotalSpent?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  registrationDateFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  registrationDateTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class CreateCustomerGroupDto {
  @ApiProperty({ description: 'Group name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Group description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Group code' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ description: 'Discount percentage' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discountPercentage?: number;

  @ApiPropertyOptional({ description: 'Fixed discount amount' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fixedDiscountAmount?: number;

  @ApiPropertyOptional({ description: 'Free shipping threshold' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  freeShippingThreshold?: number;

  @ApiPropertyOptional({ description: 'Priority level' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priority?: number;

  @ApiPropertyOptional({ description: 'Is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Group criteria' })
  @IsOptional()
  @IsObject()
  criteria?: GroupCriteriaDto;

  @ApiPropertyOptional({ description: 'Group color' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ description: 'Group icon' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ description: 'Special benefits' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @ApiPropertyOptional({ description: 'Created by user' })
  @IsOptional()
  @IsString()
  createdBy?: string;
}