import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getDatabaseConfig } from './config/database.config';
import { databaseConfig, appConfig, swaggerConfig, jwtConfig } from './config/env.config';

// Feature modules
import { AdminModule } from './modules/admin/admin.module';
import { ProductModule } from './modules/product/product.module';
import { CustomerModule } from './modules/customer/customer.module';
import { BrandModule } from './modules/brand/brand.module';
import { OrderModule } from './modules/order/order.module';
import { CartModule } from './modules/cart/cart.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ShippingModule } from './modules/shipping/shipping.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { GiftModule } from './modules/gift/gift.module';
import { BookModule } from './modules/book/book.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig, appConfig, swaggerConfig, jwtConfig],
    }),
    
    // Database
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    
    // Feature modules
    AdminModule,
    ProductModule,
    CustomerModule,
    BrandModule,
    OrderModule,
    CartModule,
    CouponModule,
    PaymentModule,
    ShippingModule,
    InventoryModule,
    SupplierModule,
    PricingModule,
    GiftModule,
    BookModule,
  ],
})
export class AppModule {} 