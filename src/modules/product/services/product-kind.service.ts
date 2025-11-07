import { Injectable } from '@nestjs/common';
import { BaseService } from '../../../common/services/base.service';
import { ProductKind } from '../schemas/product-kind.schema';
import { ProductKindRepository } from '../repositories/product-kind.repository';

@Injectable()
export class ProductKindService extends BaseService<ProductKind> {
  constructor(private readonly kindRepository: ProductKindRepository) {
    super(kindRepository);
  }
}

