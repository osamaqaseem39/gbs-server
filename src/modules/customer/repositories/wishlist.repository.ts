import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { Wishlist, WishlistDocument } from '../schemas/wishlist.schema';

@Injectable()
export class WishlistRepository extends BaseRepository<WishlistDocument> {
  constructor(
    @InjectModel(Wishlist.name) private readonly wishlistModel: Model<WishlistDocument>,
  ) {
    super(wishlistModel);
  }

  async findByCustomerId(customerId: string): Promise<WishlistDocument[]> {
    return this.wishlistModel.find({ customerId }).sort({ isDefault: -1, createdAt: -1 }).exec();
  }

  async findDefaultWishlist(customerId: string): Promise<WishlistDocument | null> {
    return this.wishlistModel.findOne({ customerId, isDefault: true }).exec();
  }

  async findPublicWishlists(): Promise<WishlistDocument[]> {
    return this.wishlistModel.find({ isPublic: true }).sort({ createdAt: -1 }).exec();
  }

  async findByCustomerAndName(customerId: string, name: string): Promise<WishlistDocument | null> {
    return this.wishlistModel.findOne({ customerId, name }).exec();
  }

  async addItemToWishlist(wishlistId: string, item: any): Promise<WishlistDocument | null> {
    return this.wishlistModel.findByIdAndUpdate(
      wishlistId,
      { 
        $push: { items: item },
        $inc: { itemsCount: 1 }
      },
      { new: true }
    ).exec();
  }

  async removeItemFromWishlist(wishlistId: string, productId: string, variantId?: string): Promise<WishlistDocument | null> {
    const filter: any = { productId };
    if (variantId) {
      filter.variantId = variantId;
    }

    return this.wishlistModel.findByIdAndUpdate(
      wishlistId,
      { 
        $pull: { items: filter },
        $inc: { itemsCount: -1 }
      },
      { new: true }
    ).exec();
  }

  async updateItemInWishlist(wishlistId: string, productId: string, variantId: string | undefined, updates: any): Promise<WishlistDocument | null> {
    const filter: any = { productId };
    if (variantId) {
      filter.variantId = variantId;
    }

    return this.wishlistModel.findOneAndUpdate(
      { _id: wishlistId, 'items': { $elemMatch: filter } },
      { $set: { 'items.$': { ...filter, ...updates } } },
      { new: true }
    ).exec();
  }

  async setDefaultWishlist(customerId: string, wishlistId: string): Promise<WishlistDocument | null> {
    // First, unset all default wishlists for this customer
    await this.wishlistModel.updateMany(
      { customerId },
      { isDefault: false }
    );

    // Then set the new default
    return this.wishlistModel.findByIdAndUpdate(
      wishlistId,
      { isDefault: true },
      { new: true }
    ).exec();
  }

  async getWishlistStats(): Promise<any> {
    const totalWishlists = await this.wishlistModel.countDocuments();
    const publicWishlists = await this.wishlistModel.countDocuments({ isPublic: true });
    
    const totalItems = await this.wishlistModel.aggregate([
      { $group: { _id: null, total: { $sum: '$itemsCount' } } }
    ]);

    const totalValue = await this.wishlistModel.aggregate([
      { $group: { _id: null, total: { $sum: '$totalValue' } } }
    ]);

    return {
      totalWishlists,
      publicWishlists,
      totalItems: totalItems.length > 0 ? totalItems[0].total : 0,
      totalValue: totalValue.length > 0 ? totalValue[0].total : 0,
    };
  }
}