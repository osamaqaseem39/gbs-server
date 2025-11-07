import { IsString, IsOptional, IsBoolean, IsArray, IsMongoId, IsNumber, Min, Max, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class WishlistItemDto {
  @ApiProperty({ description: 'Product ID' })
  @IsMongoId()
  productId: string;

  @ApiPropertyOptional({ description: 'Product variant ID' })
  @IsOptional()
  @IsMongoId()
  variantId?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Priority' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  priority?: number;
}

export class CreateWishlistDto {
  @ApiProperty({ description: 'Customer ID' })
  @IsMongoId()
  customerId: string;

  @ApiPropertyOptional({ description: 'Wishlist name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Is default wishlist' })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({ description: 'Is public' })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiPropertyOptional({ description: 'Wishlist items' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WishlistItemDto)
  items?: WishlistItemDto[];

  @ApiPropertyOptional({ description: 'Currency' })
  @IsOptional()
  @IsString()
  currency?: string;
}