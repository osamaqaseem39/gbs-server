import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GiftServiceController } from './controllers/gift-service.controller';
import { GiftCardController } from './controllers/gift-card.controller';
import { GiftServiceService } from './services/gift-service.service';
import { GiftCardService } from './services/gift-card.service';
import { GiftServiceRepository } from './repositories/gift-service.repository';
import { GiftCardRepository } from './repositories/gift-card.repository';
import { GiftService, GiftServiceSchema } from './schemas/gift-service.schema';
import { GiftCard, GiftCardSchema } from './schemas/gift-card.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GiftService.name, schema: GiftServiceSchema },
      { name: GiftCard.name, schema: GiftCardSchema },
    ]),
  ],
  controllers: [GiftServiceController, GiftCardController],
  providers: [
    GiftServiceService,
    GiftCardService,
    GiftServiceRepository,
    GiftCardRepository,
  ],
  exports: [
    GiftServiceService,
    GiftCardService,
    GiftServiceRepository,
    GiftCardRepository,
  ],
})
export class GiftModule {}