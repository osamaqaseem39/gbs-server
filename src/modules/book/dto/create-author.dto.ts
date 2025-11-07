import { IsString, IsOptional, IsDateString, IsArray, IsBoolean, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class SocialMediaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  twitter?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  facebook?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  instagram?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  linkedin?: string;
}

export class CreateAuthorDto {
  @ApiProperty({ description: 'Author name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Author slug' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ description: 'Biography' })
  @IsOptional()
  @IsString()
  biography?: string;

  @ApiPropertyOptional({ description: 'Date of birth' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ description: 'Date of death' })
  @IsOptional()
  @IsDateString()
  dateOfDeath?: string;

  @ApiPropertyOptional({ description: 'Nationality' })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiPropertyOptional({ description: 'Website' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ description: 'Social media links' })
  @IsOptional()
  socialMedia?: SocialMediaDto;

  @ApiPropertyOptional({ description: 'Author photo URL' })
  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @ApiPropertyOptional({ description: 'Is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Awards' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  awards?: string[];

  @ApiPropertyOptional({ description: 'Genres' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  genres?: string[];
}