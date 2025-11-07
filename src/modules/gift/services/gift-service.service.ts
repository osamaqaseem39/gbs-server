import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../../common/services/base.service';
import { GiftService } from '../schemas/gift-service.schema';
import { GiftServiceRepository } from '../repositories/gift-service.repository';
import { GiftServiceType } from '../schemas/gift-service.schema';

@Injectable()
export class GiftServiceService extends BaseService<GiftService> {
  constructor(private readonly giftServiceRepository: GiftServiceRepository) {
    super(giftServiceRepository);
  }

  async findByType(type: GiftServiceType): Promise<GiftService[]> {
    return this.giftServiceRepository.findByType(type);
  }

  async findActiveServices(): Promise<GiftService[]> {
    return this.giftServiceRepository.findActiveServices();
  }

  async findFreeServices(): Promise<GiftService[]> {
    return this.giftServiceRepository.findFreeServices();
  }

  async findByFreeThreshold(orderAmount: number): Promise<GiftService[]> {
    return this.giftServiceRepository.findByFreeThreshold(orderAmount);
  }

  async getAvailableServices(orderAmount: number = 0): Promise<GiftService[]> {
    const allServices = await this.findActiveServices();
    
    return allServices.filter(service => {
      // If it's free, check if order amount meets threshold
      if (service.isFree) {
        return !service.freeThreshold || orderAmount >= service.freeThreshold;
      }
      // If it's paid, always include it
      return true;
    });
  }

  async calculateServicePrice(serviceId: string, orderAmount: number = 0): Promise<number> {
    const service = await this.findById(serviceId);
    
    if (service.isFree) {
      if (!service.freeThreshold || orderAmount >= service.freeThreshold) {
        return 0;
      }
    }
    
    return service.price;
  }
}