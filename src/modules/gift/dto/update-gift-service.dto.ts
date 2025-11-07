import { PartialType } from '@nestjs/swagger';
import { CreateGiftServiceDto } from './create-gift-service.dto';

export class UpdateGiftServiceDto extends PartialType(CreateGiftServiceDto) {}