import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerController } from './controllers/customer.controller';
import { CustomerGroupController } from './controllers/customer-group.controller';
import { WishlistController } from './controllers/wishlist.controller';
import { CustomerService } from './services/customer.service';
import { CustomerGroupService } from './services/customer-group.service';
import { WishlistService } from './services/wishlist.service';
import { CustomerRepository } from './repositories/customer.repository';
import { CustomerGroupRepository } from './repositories/customer-group.repository';
import { WishlistRepository } from './repositories/wishlist.repository';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import { CustomerGroup, CustomerGroupSchema } from './schemas/customer-group.schema';
import { Wishlist, WishlistSchema } from './schemas/wishlist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: CustomerGroup.name, schema: CustomerGroupSchema },
      { name: Wishlist.name, schema: WishlistSchema },
    ]),
  ],
  controllers: [CustomerController, CustomerGroupController, WishlistController],
  providers: [
    CustomerService,
    CustomerGroupService,
    WishlistService,
    CustomerRepository,
    CustomerGroupRepository,
    WishlistRepository,
  ],
  exports: [
    CustomerService,
    CustomerGroupService,
    WishlistService,
    CustomerRepository,
    CustomerGroupRepository,
    WishlistRepository,
  ],
})
export class CustomerModule {} 