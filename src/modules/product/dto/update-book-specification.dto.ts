import { PartialType } from '@nestjs/swagger';
import { CreateBookSpecificationDto } from './create-book-specification.dto';

export class UpdateBookSpecificationDto extends PartialType(CreateBookSpecificationDto) {}
