import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { Cart, CartDocument } from '../schemas/cart.schema';
import { CartItem, CartItemDocument } from '../schemas/cart-item.schema';

@Injectable()
export class CartRepository extends BaseRepository<CartDocument> {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
    @InjectModel(CartItem.name) private readonly cartItemModel: Model<CartItemDocument>,
  ) {
    super(cartModel);
  }

  async findBySessionId(sessionId: string): Promise<CartDocument | null> {
    return await this.cartModel.findOne({ sessionId }).populate('items').exec();
  }

  async findByCustomerId(customerId: string): Promise<CartDocument | null> {
    return await this.cartModel.findOne({ customerId }).populate('items').exec();
  }

  async findById(id: string): Promise<CartDocument | null> {
    return await this.cartModel.findById(id).populate('items').exec();
  }

  async addItemToCart(cartId: string, item: any): Promise<CartDocument | null> {
    // Create CartItem document
    const cartItem = new this.cartItemModel({
      cartId,
      productId: item.productId,
      variationId: item.variationId,
      quantity: item.quantity,
      price: item.price,
    });
    await cartItem.save();

    // Add item reference to cart and update total
    return await this.cartModel.findByIdAndUpdate(
      cartId,
      {
        $push: { items: cartItem._id },
        $inc: { total: item.price * item.quantity },
        updatedAt: new Date(),
      },
      { new: true }
    ).populate('items').exec();
  }

  async updateCartItemQuantity(cartId: string, productId: string, variationId: string | null, quantity: number): Promise<CartDocument | null> {
    const cart = await this.findById(cartId);
    if (!cart) return null;

    // Find CartItem by productId and variationId
    const cartItems = await this.cartItemModel.find({
      cartId,
      productId,
      variationId: variationId || { $exists: false },
    }).exec();

    if (cartItems.length === 0) return null;

    const cartItem = cartItems[0];
    const oldQuantity = cartItem.quantity;
    const quantityDiff = quantity - oldQuantity;
    const totalDiff = cartItem.price * quantityDiff;

    // Update CartItem quantity
    cartItem.quantity = quantity;
    await cartItem.save();

    // Update cart total
    return await this.cartModel.findByIdAndUpdate(
      cartId,
      {
        $inc: { total: totalDiff },
        updatedAt: new Date(),
      },
      { new: true }
    ).populate('items').exec();
  }

  async removeItemFromCart(cartId: string, productId: string, variationId: string | null): Promise<CartDocument | null> {
    const cart = await this.findById(cartId);
    if (!cart) return null;

    // Find CartItem by productId and variationId
    const cartItems = await this.cartItemModel.find({
      cartId,
      productId,
      variationId: variationId || { $exists: false },
    }).exec();

    if (cartItems.length === 0) return null;

    const cartItem = cartItems[0];
    const totalDiff = -(cartItem.price * cartItem.quantity);

    // Remove CartItem reference from cart
    await this.cartModel.findByIdAndUpdate(
      cartId,
      {
        $pull: { items: cartItem._id },
        $inc: { total: totalDiff },
        updatedAt: new Date(),
      }
    ).exec();

    // Delete CartItem document
    await this.cartItemModel.findByIdAndDelete(cartItem._id).exec();

    return await this.findById(cartId);
  }

  async clearCart(cartId: string): Promise<CartDocument | null> {
    // Delete all CartItem documents for this cart
    await this.cartItemModel.deleteMany({ cartId }).exec();

    // Clear items array and reset total
    return await this.cartModel.findByIdAndUpdate(
      cartId,
      {
        $set: { items: [], total: 0, updatedAt: new Date() }
      },
      { new: true }
    ).populate('items').exec();
  }

  async assignCartToCustomer(sessionId: string, customerId: string): Promise<CartDocument | null> {
    return await this.cartModel.findOneAndUpdate(
      { sessionId },
      { customerId, updatedAt: new Date() },
      { new: true }
    ).exec();
  }
} 