import { IsString, IsOptional, IsBoolean, IsNumber, IsObject, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AddressDto {
  @ApiProperty()
  @IsString()
  street: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsString()
  postalCode: string;

  @ApiProperty()
  @IsString()
  country: string;
}

class ContactDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  manager?: string;
}

class OperatingHoursDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  monday?: { open: string; close: string };

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  tuesday?: { open: string; close: string };

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  wednesday?: { open: string; close: string };

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  thursday?: { open: string; close: string };

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  friday?: { open: string; close: string };

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  saturday?: { open: string; close: string };

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  sunday?: { open: string; close: string };
}

export class CreateWarehouseDto {
  @ApiProperty({ description: 'Warehouse name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Warehouse code' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ description: 'Warehouse description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Address' })
  @IsObject()
  address: AddressDto;

  @ApiPropertyOptional({ description: 'Contact information' })
  @IsOptional()
  @IsObject()
  contact?: ContactDto;

  @ApiPropertyOptional({ description: 'Warehouse capacity' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  capacity?: number;

  @ApiPropertyOptional({ description: 'Is primary warehouse' })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({ description: 'Is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Operating hours' })
  @IsOptional()
  @IsObject()
  operatingHours?: OperatingHoursDto;
}