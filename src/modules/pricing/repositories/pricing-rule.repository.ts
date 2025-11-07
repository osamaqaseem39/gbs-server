import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { PricingRule, PricingRuleDocument } from '../schemas/pricing-rule.schema';
import { PricingRuleType } from '../schemas/pricing-rule.schema';

@Injectable()
export class PricingRuleRepository extends BaseRepository<PricingRuleDocument> {
  constructor(
    @InjectModel(PricingRule.name) private readonly pricingRuleModel: Model<PricingRuleDocument>,
  ) {
    super(pricingRuleModel);
  }

  async findActiveRules(): Promise<PricingRuleDocument[]> {
    const now = new Date();
    return this.pricingRuleModel.find({
      isActive: true,
      $and: [
        {
          $or: [
            { validFrom: { $exists: false } },
            { validFrom: { $lte: now } },
          ]
        },
        {
          $or: [
            { validTo: { $exists: false } },
            { validTo: { $gte: now } },
          ]
        }
      ],
    }).sort({ priority: -1 }).exec();
  }

  async findByType(type: PricingRuleType): Promise<PricingRuleDocument[]> {
    return this.pricingRuleModel.find({ type, isActive: true }).sort({ priority: -1 }).exec();
  }

  async findByProductId(productId: string): Promise<PricingRuleDocument[]> {
    return this.pricingRuleModel.find({
      productIds: productId,
      isActive: true,
    }).sort({ priority: -1 }).exec();
  }

  async findByCategoryId(categoryId: string): Promise<PricingRuleDocument[]> {
    return this.pricingRuleModel.find({
      categoryIds: categoryId,
      isActive: true,
    }).sort({ priority: -1 }).exec();
  }

  async findByBrandId(brandId: string): Promise<PricingRuleDocument[]> {
    return this.pricingRuleModel.find({
      brandIds: brandId,
      isActive: true,
    }).sort({ priority: -1 }).exec();
  }

  async findByCustomerGroupId(customerGroupId: string): Promise<PricingRuleDocument[]> {
    return this.pricingRuleModel.find({
      customerGroupIds: customerGroupId,
      isActive: true,
    }).sort({ priority: -1 }).exec();
  }

  async findApplicableRules(
    productIds?: string[],
    categoryIds?: string[],
    brandIds?: string[],
    customerGroupIds?: string[],
    quantity?: number,
    orderAmount?: number
  ): Promise<PricingRuleDocument[]> {
    const now = new Date();
    const query: any = {
      isActive: true,
      $and: [
        {
          $or: [
            { validFrom: { $exists: false } },
            { validFrom: { $lte: now } },
          ]
        },
        {
          $or: [
            { validTo: { $exists: false } },
            { validTo: { $gte: now } },
          ]
        }
      ],
    };

    // Add product/category/brand filters
    if (productIds?.length || categoryIds?.length || brandIds?.length) {
      query.$or = [
        { productIds: { $in: productIds || [] } },
        { categoryIds: { $in: categoryIds || [] } },
        { brandIds: { $in: brandIds || [] } },
      ];
    }

    // Add customer group filter
    if (customerGroupIds?.length) {
      query.customerGroupIds = { $in: customerGroupIds };
    }

    // Add quantity filter
    if (quantity) {
      query.$and = [
        { $or: [{ minQuantity: { $exists: false } }, { minQuantity: { $lte: quantity } }] },
        { $or: [{ maxQuantity: { $exists: false } }, { maxQuantity: { $gte: quantity } }] },
      ];
    }

    // Add order amount filter
    if (orderAmount) {
      query.$and = [
        ...(query.$and || []),
        { $or: [{ minOrderAmount: { $exists: false } }, { minOrderAmount: { $lte: orderAmount } }] },
        { $or: [{ maxOrderAmount: { $exists: false } }, { maxOrderAmount: { $gte: orderAmount } }] },
      ];
    }

    return this.pricingRuleModel.find(query).sort({ priority: -1 }).exec();
  }

  async incrementUsageCount(ruleId: string): Promise<PricingRuleDocument | null> {
    return this.pricingRuleModel.findByIdAndUpdate(
      ruleId,
      { $inc: { usageCount: 1 } },
      { new: true }
    ).exec();
  }

  async getRuleStats(): Promise<any> {
    const totalRules = await this.pricingRuleModel.countDocuments();
    const activeRules = await this.pricingRuleModel.countDocuments({ isActive: true });
    const expiredRules = await this.pricingRuleModel.countDocuments({
      validTo: { $lt: new Date() },
      isActive: true,
    });

    const rulesByType = await this.pricingRuleModel.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    return {
      totalRules,
      activeRules,
      expiredRules,
      rulesByType: rulesByType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    };
  }
}