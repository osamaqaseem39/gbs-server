import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../admin/guards/jwt-auth.guard';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { ProductRepository } from './repositories/product.repository';
import { Product, ProductSchema } from './schemas/product.schema';
import { Category, CategorySchema } from './schemas/category.schema';
import { Tag, TagSchema } from './schemas/tag.schema';
import { Attribute, AttributeSchema } from './schemas/attribute.schema';
import { ProductImage, ProductImageSchema } from './schemas/product-image.schema';
import { ProductVariation, ProductVariationSchema } from './schemas/product-variation.schema';
import { ProductKind, ProductKindSchema } from './schemas/product-kind.schema';
import { ProductKindRepository } from './repositories/product-kind.repository';
import { ProductKindService } from './services/product-kind.service';
import { ProductKindController } from './controllers/product-kind.controller';
// New schemas
import { Uniform, UniformSchema } from './schemas/uniform.schema';
import { BookSpecification, BookSpecificationSchema } from './schemas/book-specification.schema';
import { SchoolSet, SchoolSetSchema } from './schemas/school-set.schema';
// New repositories
import { UniformRepository } from './repositories/uniform.repository';
import { BookSpecificationRepository } from './repositories/book-specification.repository';
import { SchoolSetRepository } from './repositories/school-set.repository';
// New services
import { UniformService } from './services/uniform.service';
import { BookSpecificationService } from './services/book-specification.service';
import { SchoolSetService } from './services/school-set.service';
// New controllers
import { UniformController } from './controllers/uniform.controller';
import { BookSpecificationController } from './controllers/book-specification.controller';
import { SchoolSetController } from './controllers/school-set.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Tag.name, schema: TagSchema },
      { name: Attribute.name, schema: AttributeSchema },
      { name: ProductImage.name, schema: ProductImageSchema },
      { name: ProductVariation.name, schema: ProductVariationSchema },
      { name: ProductKind.name, schema: ProductKindSchema },
      // New schemas
      { name: Uniform.name, schema: UniformSchema },
      { name: BookSpecification.name, schema: BookSpecificationSchema },
      { name: SchoolSet.name, schema: SchoolSetSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: { 
          expiresIn: configService.get('jwt.expiresIn') || '7d' 
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    ProductController, 
    ProductKindController,
    UniformController,
    BookSpecificationController,
    SchoolSetController
  ],
  providers: [
    ProductService, 
    ProductRepository, 
    ProductKindService, 
    ProductKindRepository,
    UniformService,
    UniformRepository,
    BookSpecificationService,
    BookSpecificationRepository,
    SchoolSetService,
    SchoolSetRepository,
    JwtAuthGuard
  ],
  exports: [
    ProductService, 
    ProductRepository, 
    ProductKindService, 
    ProductKindRepository,
    UniformRepository,
    BookSpecificationService,
    BookSpecificationRepository,
    SchoolSetService,
    SchoolSetRepository
  ],
})
export class ProductModule {} 