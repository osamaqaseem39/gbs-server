import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PricingRuleController } from './controllers/pricing-rule.controller';
import { PricingRuleService } from './services/pricing-rule.service';
import { PricingRuleRepository } from './repositories/pricing-rule.repository';
import { PricingRule, PricingRuleSchema } from './schemas/pricing-rule.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PricingRule.name, schema: PricingRuleSchema },
    ]),
  ],
  controllers: [PricingRuleController],
  providers: [
    PricingRuleService,
    PricingRuleRepository,
  ],
  exports: [
    PricingRuleService,
    PricingRuleRepository,
  ],
})
export class PricingModule {}