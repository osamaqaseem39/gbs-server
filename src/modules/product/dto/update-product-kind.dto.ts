import { PartialType } from '@nestjs/swagger';
import { CreateProductKindDto } from './create-product-kind.dto';

export class UpdateProductKindDto extends PartialType(CreateProductKindDto) {}

