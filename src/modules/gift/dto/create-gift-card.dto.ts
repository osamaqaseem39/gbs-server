import { IsString, IsOptional, IsEnum, IsNumber, IsEmail, IsMongoId, IsBoolean, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GiftCardStatus } from '../schemas/gift-card.schema';

export class CreateGiftCardDto {
  @ApiProperty({ description: 'Gift card code' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Original amount' })
  @IsNumber()
  @Min(0)
  originalAmount: number;

  @ApiProperty({ description: 'Currency' })
  @IsString()
  currency: string;

  @ApiPropertyOptional({ enum: GiftCardStatus, description: 'Card status' })
  @IsOptional()
  @IsEnum(GiftCardStatus)
  status?: GiftCardStatus;

  @ApiPropertyOptional({ description: 'Purchased by customer' })
  @IsOptional()
  @IsMongoId()
  purchasedBy?: string;

  @ApiPropertyOptional({ description: 'Recipient email' })
  @IsOptional()
  @IsEmail()
  recipientEmail?: string;

  @ApiPropertyOptional({ description: 'Recipient name' })
  @IsOptional()
  @IsString()
  recipientName?: string;

  @ApiPropertyOptional({ description: 'Gift message' })
  @IsOptional()
  @IsString()
  giftMessage?: string;

  @ApiPropertyOptional({ description: 'Expiry date' })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @ApiPropertyOptional({ description: 'Is digital' })
  @IsOptional()
  @IsBoolean()
  isDigital?: boolean;

  @ApiPropertyOptional({ description: 'Delivery method' })
  @IsOptional()
  @IsString()
  deliveryMethod?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Purchase order ID' })
  @IsOptional()
  @IsMongoId()
  purchaseOrderId?: string;
}