import { PartialType } from '@nestjs/swagger';
import { CreateBookSeriesDto } from './create-book-series.dto';

export class UpdateBookSeriesDto extends PartialType(CreateBookSeriesDto) {}