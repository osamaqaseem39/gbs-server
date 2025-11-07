import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { GiftService, GiftServiceDocument } from '../schemas/gift-service.schema';
import { GiftServiceType } from '../schemas/gift-service.schema';

@Injectable()
export class GiftServiceRepository extends BaseRepository<GiftServiceDocument> {
  constructor(
    @InjectModel(GiftService.name) private readonly giftServiceModel: Model<GiftServiceDocument>,
  ) {
    super(giftServiceModel);
  }

  async findByType(type: GiftServiceType): Promise<GiftServiceDocument[]> {
    return this.giftServiceModel.find({ type, isActive: true }).sort({ sortOrder: 1 }).exec();
  }

  async findActiveServices(): Promise<GiftServiceDocument[]> {
    return this.giftServiceModel.find({ isActive: true }).sort({ sortOrder: 1 }).exec();
  }

  async findFreeServices(): Promise<GiftServiceDocument[]> {
    return this.giftServiceModel.find({ isFree: true, isActive: true }).sort({ sortOrder: 1 }).exec();
  }

  async findByFreeThreshold(orderAmount: number): Promise<GiftServiceDocument[]> {
    return this.giftServiceModel.find({
      isFree: true,
      isActive: true,
      freeThreshold: { $lte: orderAmount },
    }).sort({ sortOrder: 1 }).exec();
  }
}