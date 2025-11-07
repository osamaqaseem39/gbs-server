import { IsString, IsNumber, IsOptional, IsEnum, IsMongoId, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InventoryStatus } from '../schemas/inventory.schema';

export class CreateInventoryDto {
  @ApiProperty({ description: 'Product ID' })
  @IsMongoId()
  productId: string;

  @ApiPropertyOptional({ description: 'Product variant ID' })
  @IsOptional()
  @IsMongoId()
  variantId?: string;

  @ApiProperty({ description: 'Warehouse ID' })
  @IsMongoId()
  warehouseId: string;

  @ApiProperty({ description: 'Current stock quantity' })
  @IsNumber()
  @Min(0)
  currentStock: number;

  @ApiPropertyOptional({ description: 'Reserved stock quantity' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  reservedStock?: number;

  @ApiPropertyOptional({ description: 'Reorder point' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  reorderPoint?: number;

  @ApiPropertyOptional({ description: 'Reorder quantity' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  reorderQuantity?: number;

  @ApiPropertyOptional({ description: 'Maximum stock level' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxStockLevel?: number;

  @ApiPropertyOptional({ description: 'Cost price' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costPrice?: number;

  @ApiPropertyOptional({ enum: InventoryStatus, description: 'Inventory status' })
  @IsOptional()
  @IsEnum(InventoryStatus)
  status?: InventoryStatus;

  @ApiPropertyOptional({ description: 'Location within warehouse' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Barcode/SKU for scanning' })
  @IsOptional()
  @IsString()
  barcode?: string;
}