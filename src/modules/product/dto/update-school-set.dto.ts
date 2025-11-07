import { PartialType } from '@nestjs/swagger';
import { CreateSchoolSetDto } from './create-school-set.dto';

export class UpdateSchoolSetDto extends PartialType(CreateSchoolSetDto) {}
