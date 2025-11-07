import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BaseService } from '../../../common/services/base.service';
import { GiftCard } from '../schemas/gift-card.schema';
import { GiftCardRepository } from '../repositories/gift-card.repository';
import { GiftCardStatus } from '../schemas/gift-card.schema';

@Injectable()
export class GiftCardService extends BaseService<GiftCard> {
  constructor(private readonly giftCardRepository: GiftCardRepository) {
    super(giftCardRepository);
  }

  async findByCode(code: string): Promise<GiftCard> {
    const giftCard = await this.giftCardRepository.findByCode(code);
    if (!giftCard) {
      throw new NotFoundException('Gift card not found');
    }
    return giftCard;
  }

  async findByStatus(status: GiftCardStatus): Promise<GiftCard[]> {
    return this.giftCardRepository.findByStatus(status);
  }

  async findByPurchasedBy(customerId: string): Promise<GiftCard[]> {
    return this.giftCardRepository.findByPurchasedBy(customerId);
  }

  async findByRecipientEmail(email: string): Promise<GiftCard[]> {
    return this.giftCardRepository.findByRecipientEmail(email);
  }

  async findActiveCards(): Promise<GiftCard[]> {
    return this.giftCardRepository.findActiveCards();
  }

  async findExpiredCards(): Promise<GiftCard[]> {
    return this.giftCardRepository.findExpiredCards();
  }

  async findUsedCards(): Promise<GiftCard[]> {
    return this.giftCardRepository.findUsedCards();
  }

  async useGiftCard(code: string, usedBy: string, orderId: string, amount: number): Promise<GiftCard> {
    const giftCard = await this.findByCode(code);
    
    if (giftCard.status !== GiftCardStatus.ACTIVE) {
      throw new BadRequestException('Gift card is not active');
    }

    if (giftCard.expiryDate && giftCard.expiryDate < new Date()) {
      throw new BadRequestException('Gift card has expired');
    }

    if (giftCard.currentBalance < amount) {
      throw new BadRequestException('Insufficient gift card balance');
    }

    const newBalance = giftCard.currentBalance - amount;
    const newStatus = newBalance <= 0 ? GiftCardStatus.USED : GiftCardStatus.ACTIVE;

    return this.giftCardRepository.update(giftCard._id, {
      currentBalance: newBalance,
      status: newStatus,
      usedBy,
      usedAt: new Date(),
      usedInOrder: orderId,
    });
  }

  async refundGiftCard(code: string, amount: number): Promise<GiftCard> {
    const giftCard = await this.findByCode(code);
    
    if (giftCard.status !== GiftCardStatus.USED) {
      throw new BadRequestException('Gift card is not used');
    }

    const newBalance = giftCard.currentBalance + amount;
    const newStatus = newBalance > 0 ? GiftCardStatus.ACTIVE : GiftCardStatus.USED;

    return this.giftCardRepository.update(giftCard._id, {
      currentBalance: newBalance,
      status: newStatus,
      usedBy: undefined,
      usedAt: undefined,
      usedInOrder: undefined,
    });
  }

  async expireGiftCard(code: string): Promise<GiftCard> {
    const giftCard = await this.findByCode(code);
    
    if (giftCard.status !== GiftCardStatus.ACTIVE) {
      throw new BadRequestException('Gift card is not active');
    }

    return this.giftCardRepository.update(giftCard._id, {
      status: GiftCardStatus.EXPIRED,
    });
  }

  async generateGiftCardCode(): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    
    for (let i = 0; i < 12; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Check if code already exists
    const existingCard = await this.giftCardRepository.findByCode(result);
    if (existingCard) {
      return this.generateGiftCardCode(); // Recursively generate new code
    }
    
    return result;
  }

  async getGiftCardStats(): Promise<any> {
    return this.giftCardRepository.getGiftCardStats();
  }

  async validateGiftCard(code: string): Promise<{ valid: boolean; balance: number; message?: string }> {
    try {
      const giftCard = await this.findByCode(code);
      
      if (giftCard.status !== GiftCardStatus.ACTIVE) {
        return { valid: false, balance: 0, message: 'Gift card is not active' };
      }

      if (giftCard.expiryDate && giftCard.expiryDate < new Date()) {
        return { valid: false, balance: 0, message: 'Gift card has expired' };
      }

      return { valid: true, balance: giftCard.currentBalance };
    } catch (error) {
      return { valid: false, balance: 0, message: 'Gift card not found' };
    }
  }
}