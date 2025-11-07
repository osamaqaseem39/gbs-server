import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { GiftCard, GiftCardDocument } from '../schemas/gift-card.schema';
import { GiftCardStatus } from '../schemas/gift-card.schema';

@Injectable()
export class GiftCardRepository extends BaseRepository<GiftCardDocument> {
  constructor(
    @InjectModel(GiftCard.name) private readonly giftCardModel: Model<GiftCardDocument>,
  ) {
    super(giftCardModel);
  }

  async findByCode(code: string): Promise<GiftCardDocument | null> {
    return this.giftCardModel.findOne({ code }).exec();
  }

  async findByStatus(status: GiftCardStatus): Promise<GiftCardDocument[]> {
    return this.giftCardModel.find({ status }).sort({ createdAt: -1 }).exec();
  }

  async findByPurchasedBy(customerId: string): Promise<GiftCardDocument[]> {
    return this.giftCardModel.find({ purchasedBy: customerId }).sort({ createdAt: -1 }).exec();
  }

  async findByRecipientEmail(email: string): Promise<GiftCardDocument[]> {
    return this.giftCardModel.find({ recipientEmail: email }).sort({ createdAt: -1 }).exec();
  }

  async findActiveCards(): Promise<GiftCardDocument[]> {
    return this.giftCardModel.find({ 
      status: GiftCardStatus.ACTIVE,
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: { $gt: new Date() } },
      ],
    }).sort({ createdAt: -1 }).exec();
  }

  async findExpiredCards(): Promise<GiftCardDocument[]> {
    return this.giftCardModel.find({
      status: GiftCardStatus.ACTIVE,
      expiryDate: { $lte: new Date() },
    }).exec();
  }

  async findUsedCards(): Promise<GiftCardDocument[]> {
    return this.giftCardModel.find({ status: GiftCardStatus.USED }).sort({ usedAt: -1 }).exec();
  }

  async getGiftCardStats(): Promise<any> {
    const totalCards = await this.giftCardModel.countDocuments();
    const activeCards = await this.giftCardModel.countDocuments({ status: GiftCardStatus.ACTIVE });
    const usedCards = await this.giftCardModel.countDocuments({ status: GiftCardStatus.USED });
    const expiredCards = await this.giftCardModel.countDocuments({ status: GiftCardStatus.EXPIRED });

    const totalValue = await this.giftCardModel.aggregate([
      { $group: { _id: null, total: { $sum: '$originalAmount' } } }
    ]);

    const usedValue = await this.giftCardModel.aggregate([
      { $match: { status: GiftCardStatus.USED } },
      { $group: { _id: null, total: { $sum: '$originalAmount' } } }
    ]);

    const activeValue = await this.giftCardModel.aggregate([
      { $match: { status: GiftCardStatus.ACTIVE } },
      { $group: { _id: null, total: { $sum: '$currentBalance' } } }
    ]);

    return {
      totalCards,
      activeCards,
      usedCards,
      expiredCards,
      totalValue: totalValue.length > 0 ? totalValue[0].total : 0,
      usedValue: usedValue.length > 0 ? usedValue[0].total : 0,
      activeValue: activeValue.length > 0 ? activeValue[0].total : 0,
    };
  }
}