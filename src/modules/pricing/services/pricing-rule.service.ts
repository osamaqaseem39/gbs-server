import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../../common/services/base.service';
import { PricingRule } from '../schemas/pricing-rule.schema';
import { PricingRuleRepository } from '../repositories/pricing-rule.repository';
import { PricingRuleType } from '../schemas/pricing-rule.schema';

@Injectable()
export class PricingRuleService extends BaseService<PricingRule> {
  constructor(private readonly pricingRuleRepository: PricingRuleRepository) {
    super(pricingRuleRepository);
  }

  async findActiveRules(): Promise<PricingRule[]> {
    return this.pricingRuleRepository.findActiveRules();
  }

  async findByType(type: PricingRuleType): Promise<PricingRule[]> {
    return this.pricingRuleRepository.findByType(type);
  }

  async findByProductId(productId: string): Promise<PricingRule[]> {
    return this.pricingRuleRepository.findByProductId(productId);
  }

  async findByCategoryId(categoryId: string): Promise<PricingRule[]> {
    return this.pricingRuleRepository.findByCategoryId(categoryId);
  }

  async findByBrandId(brandId: string): Promise<PricingRule[]> {
    return this.pricingRuleRepository.findByBrandId(brandId);
  }

  async findByCustomerGroupId(customerGroupId: string): Promise<PricingRule[]> {
    return this.pricingRuleRepository.findByCustomerGroupId(customerGroupId);
  }

  async findApplicableRules(
    productIds?: string[],
    categoryIds?: string[],
    brandIds?: string[],
    customerGroupIds?: string[],
    quantity?: number,
    orderAmount?: number
  ): Promise<PricingRule[]> {
    return this.pricingRuleRepository.findApplicableRules(
      productIds,
      categoryIds,
      brandIds,
      customerGroupIds,
      quantity,
      orderAmount
    );
  }

  async calculateDiscount(
    productIds: string[],
    categoryIds: string[],
    brandIds: string[],
    customerGroupIds: string[],
    quantity: number,
    orderAmount: number
  ): Promise<{ rule: PricingRule; discount: number } | null> {
    const applicableRules = await this.findApplicableRules(
      productIds,
      categoryIds,
      brandIds,
      customerGroupIds,
      quantity,
      orderAmount
    );

    if (applicableRules.length === 0) {
      return null;
    }

    // Get the highest priority rule (first in the sorted array)
    const bestRule = applicableRules[0];
    let discount = 0;

    if (bestRule.discountType === 'percentage') {
      discount = (orderAmount * bestRule.discountValue) / 100;
    } else if (bestRule.discountType === 'fixed_amount') {
      discount = bestRule.discountValue;
    } else if (bestRule.discountType === 'free_shipping') {
      // This would be handled separately in shipping calculation
      discount = 0;
    }

    // Increment usage count
    await this.pricingRuleRepository.incrementUsageCount(bestRule._id);

    return { rule: bestRule, discount };
  }

  async getRuleStats(): Promise<any> {
    return this.pricingRuleRepository.getRuleStats();
  }

  async validateRule(ruleId: string): Promise<boolean> {
    const rule = await this.pricingRuleRepository.findById(ruleId);
    if (!rule) {
      throw new NotFoundException('Pricing rule not found');
    }

    const now = new Date();
    const isActive = rule.isActive;
    const isWithinDateRange = (!rule.validFrom || rule.validFrom <= now) && 
                             (!rule.validTo || rule.validTo >= now);
    const hasUsageLeft = !rule.totalUsageLimit || rule.usageCount < rule.totalUsageLimit;

    return isActive && isWithinDateRange && hasUsageLeft;
  }
}