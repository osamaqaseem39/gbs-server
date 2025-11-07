import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BaseService } from '../../../common/services/base.service';
import { Wishlist } from '../schemas/wishlist.schema';
import { WishlistRepository } from '../repositories/wishlist.repository';

@Injectable()
export class WishlistService extends BaseService<Wishlist> {
  constructor(private readonly wishlistRepository: WishlistRepository) {
    super(wishlistRepository);
  }

  async findByCustomerId(customerId: string): Promise<Wishlist[]> {
    return this.wishlistRepository.findByCustomerId(customerId);
  }

  async findDefaultWishlist(customerId: string): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findDefaultWishlist(customerId);
    if (!wishlist) {
      throw new NotFoundException('Default wishlist not found');
    }
    return wishlist;
  }

  async findPublicWishlists(): Promise<Wishlist[]> {
    return this.wishlistRepository.findPublicWishlists();
  }

  async findByCustomerAndName(customerId: string, name: string): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findByCustomerAndName(customerId, name);
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    return wishlist;
  }

  async addItemToWishlist(wishlistId: string, item: any): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.addItemToWishlist(wishlistId, item);
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    return wishlist;
  }

  async removeItemFromWishlist(wishlistId: string, productId: string, variantId?: string): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.removeItemFromWishlist(wishlistId, productId, variantId);
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    return wishlist;
  }

  async updateItemInWishlist(wishlistId: string, productId: string, variantId: string | undefined, updates: any): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.updateItemInWishlist(wishlistId, productId, variantId, updates);
    if (!wishlist) {
      throw new NotFoundException('Wishlist or item not found');
    }
    return wishlist;
  }

  async setDefaultWishlist(customerId: string, wishlistId: string): Promise<Wishlist> {
    // Verify the wishlist belongs to the customer
    const wishlist = await this.findById(wishlistId);
    if (wishlist.customerId !== customerId) {
      throw new BadRequestException('Wishlist does not belong to this customer');
    }

    const updatedWishlist = await this.wishlistRepository.setDefaultWishlist(customerId, wishlistId);
    if (!updatedWishlist) {
      throw new NotFoundException('Wishlist not found');
    }
    return updatedWishlist;
  }

  async createDefaultWishlist(customerId: string): Promise<Wishlist> {
    const existingDefault = await this.wishlistRepository.findDefaultWishlist(customerId);
    if (existingDefault) {
      return existingDefault;
    }

    return this.create({
      customerId,
      name: 'My Wishlist',
      isDefault: true,
      isPublic: false,
      items: [],
      itemsCount: 0,
      totalValue: 0,
      currency: 'USD',
    });
  }

  async getWishlistStats(): Promise<any> {
    return this.wishlistRepository.getWishlistStats();
  }

  async isItemInWishlist(customerId: string, productId: string, variantId?: string): Promise<boolean> {
    const wishlists = await this.findByCustomerId(customerId);
    
    for (const wishlist of wishlists) {
      const item = wishlist.items.find(item => {
        if (variantId) {
          return item.productId === productId && item.variantId === variantId;
        }
        return item.productId === productId;
      });
      
      if (item) {
        return true;
      }
    }
    
    return false;
  }

  async getWishlistByCustomerAndProduct(customerId: string, productId: string, variantId?: string): Promise<Wishlist | null> {
    const wishlists = await this.findByCustomerId(customerId);
    
    for (const wishlist of wishlists) {
      const item = wishlist.items.find(item => {
        if (variantId) {
          return item.productId === productId && item.variantId === variantId;
        }
        return item.productId === productId;
      });
      
      if (item) {
        return wishlist;
      }
    }
    
    return null;
  }
}