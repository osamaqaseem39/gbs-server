import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WishlistService } from '../services/wishlist.service';
import { CreateWishlistDto } from '../dto/create-wishlist.dto';
import { UpdateWishlistDto } from '../dto/update-wishlist.dto';

@ApiTags('Wishlists')
@Controller('wishlists')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  create(@Body() dto: CreateWishlistDto) {
    const wishlistData = {
      ...dto,
      items: dto.items.map(item => ({
        ...item,
        addedAt: new Date(),
        priority: item.priority || 0
      }))
    };
    return this.wishlistService.create(wishlistData);
  }

  @Post('default/:customerId')
  createDefault(@Param('customerId') customerId: string) {
    return this.wishlistService.createDefaultWishlist(customerId);
  }

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.wishlistService.findAll({ page: Number(page), limit: Number(limit) });
  }

  @Get('stats')
  getStats() {
    return this.wishlistService.getWishlistStats();
  }

  @Get('public')
  findPublic() {
    return this.wishlistService.findPublicWishlists();
  }

  @Get('customer/:customerId')
  findByCustomer(@Param('customerId') customerId: string) {
    return this.wishlistService.findByCustomerId(customerId);
  }

  @Get('customer/:customerId/default')
  findDefaultByCustomer(@Param('customerId') customerId: string) {
    return this.wishlistService.findDefaultWishlist(customerId);
  }

  @Get('customer/:customerId/name/:name')
  findByCustomerAndName(@Param('customerId') customerId: string, @Param('name') name: string) {
    return this.wishlistService.findByCustomerAndName(customerId, name);
  }

  @Get('customer/:customerId/check-item')
  checkItemInWishlist(
    @Param('customerId') customerId: string,
    @Query('productId') productId: string,
    @Query('variantId') variantId?: string
  ) {
    return this.wishlistService.isItemInWishlist(customerId, productId, variantId);
  }

  @Get('customer/:customerId/product/:productId')
  getWishlistByProduct(
    @Param('customerId') customerId: string,
    @Param('productId') productId: string,
    @Query('variantId') variantId?: string
  ) {
    return this.wishlistService.getWishlistByCustomerAndProduct(customerId, productId, variantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWishlistDto) {
    const wishlistData = {
      ...dto,
      items: dto.items?.map(item => ({
        ...item,
        addedAt: new Date(),
        priority: item.priority || 0
      }))
    };
    return this.wishlistService.update(id, wishlistData);
  }

  @Put(':id/set-default')
  setDefault(@Param('id') id: string, @Body() body: { customerId: string }) {
    return this.wishlistService.setDefaultWishlist(body.customerId, id);
  }

  @Put(':id/add-item')
  addItem(@Param('id') id: string, @Body() item: any) {
    return this.wishlistService.addItemToWishlist(id, item);
  }

  @Put(':id/remove-item')
  removeItem(
    @Param('id') id: string,
    @Body() body: { productId: string; variantId?: string }
  ) {
    return this.wishlistService.removeItemFromWishlist(id, body.productId, body.variantId);
  }

  @Put(':id/update-item')
  updateItem(
    @Param('id') id: string,
    @Body() body: { productId: string; variantId?: string; updates: any }
  ) {
    return this.wishlistService.updateItemInWishlist(id, body.productId, body.variantId, body.updates);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishlistService.delete(id);
  }
}