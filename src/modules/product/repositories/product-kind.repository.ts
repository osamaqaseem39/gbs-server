import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { ProductKind, ProductKindDocument } from '../schemas/product-kind.schema';

@Injectable()
export class ProductKindRepository extends BaseRepository<ProductKindDocument> {
  constructor(
    @InjectModel(ProductKind.name) private readonly productKindModel: Model<ProductKindDocument>,
  ) {
    super(productKindModel);
  }
}

