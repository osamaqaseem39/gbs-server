import { Injectable, ConflictException, BadRequestException, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { BaseService } from '../../../common/services/base.service';
import { ProductRepository } from '../repositories/product.repository';
import { ProductDocument } from '../schemas/product.schema';
import { ProductImage, ProductImageDocument } from '../schemas/product-image.schema';
import { ProductVariation, ProductVariationDocument, VariationStockStatus } from '../schemas/product-variation.schema';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { PaginationOptions, PaginatedResult } from '../../../common/interfaces/base.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InventoryService } from '../../inventory/services/inventory.service';

@Injectable()
export class ProductService extends BaseService<ProductDocument> {
  constructor(
    private readonly productRepository: ProductRepository,
    @InjectModel(ProductImage.name) private readonly productImageModel: Model<ProductImageDocument>,
    @InjectModel(ProductVariation.name) private readonly productVariationModel: Model<ProductVariationDocument>,
    @Inject(forwardRef(() => InventoryService)) private readonly inventoryService: InventoryService,
  ) {
    super(productRepository);
  }

  // Helper function to map ProductVariation StockStatus to Inventory status
  private mapStockStatusToInventoryStatus(stockStatus: VariationStockStatus | string): string {
    if (typeof stockStatus === 'string') {
      stockStatus = stockStatus as VariationStockStatus;
    }
    switch (stockStatus) {
      case VariationStockStatus.INSTOCK:
        return 'in_stock';
      case VariationStockStatus.OUTOFSTOCK:
        return 'out_of_stock';
      default:
        return 'in_stock';
    }
  }

  // Helper function to sync product inventory to inventory module
  private async syncToInventory(product: ProductDocument, updateProductDto?: UpdateProductDto): Promise<void> {
    if (!product.manageStock) {
      return; // Don't sync if stock management is disabled
    }

    try {
      // Product no longer has stockStatus, price, originalPrice, availableSizes
      // These are in ProductVariation. This method needs to be refactored to work with variations.
      // For now, we'll skip the sync if these properties are not available.
      // TODO: Refactor to sync variations to inventory
      return;
    } catch (error) {
      // Log error but don't fail product creation/update
      console.error('Error syncing product to inventory:', error);
    }
  }

  async createProduct(createProductDto: CreateProductDto): Promise<ProductDocument> {
    // Check if product with same slug or SKU already exists
    const existingSlug = await this.productRepository.findBySlug(createProductDto.slug);
    if (existingSlug) {
      throw new ConflictException(`Product with slug '${createProductDto.slug}' already exists`);
    }

    const existingSku = await this.productRepository.findBySku(createProductDto.sku);
    if (existingSku) {
      throw new ConflictException(`Product with SKU '${createProductDto.sku}' already exists`);
    }

    // Validate sale price is less than regular price
    if (createProductDto.salePrice && createProductDto.salePrice >= createProductDto.price) {
      throw new BadRequestException('Sale price must be less than regular price');
    }

    // Auto-set isSale and originalPrice based on salePrice
    if (createProductDto.salePrice && createProductDto.salePrice > 0 && createProductDto.salePrice < createProductDto.price) {
      createProductDto.isSale = true;
      // Set originalPrice to the regular price if not already set or if it's less than the regular price
      if (!createProductDto.originalPrice || createProductDto.originalPrice < createProductDto.price) {
        createProductDto.originalPrice = createProductDto.price;
      }
    } else if (!createProductDto.salePrice || createProductDto.salePrice === 0) {
      // If no sale price, ensure isSale is false
      createProductDto.isSale = false;
    }

    // Auto-update stock status based on quantity
    if (createProductDto.manageStock) {
      if (createProductDto.stockQuantity > 0) {
        createProductDto.stockStatus = VariationStockStatus.INSTOCK;
      } else {
        createProductDto.stockStatus = VariationStockStatus.OUTOFSTOCK;
      }
    }

    // Auto-set inStock based on stockStatus and stockQuantity
    if (createProductDto.manageStock) {
      createProductDto.inStock = createProductDto.stockStatus === VariationStockStatus.INSTOCK && 
                                  (createProductDto.stockQuantity > 0 || createProductDto.allowBackorders);
    } else {
      // If not managing stock, default to in stock
      createProductDto.inStock = true;
    }

    // Handle image creation if provided
    let imageIds: string[] = [];
    if (createProductDto.images && createProductDto.images.length > 0) {
      const imageDocuments = await Promise.all(
        createProductDto.images.map(async (imageData) => {
          const image = new this.productImageModel(imageData);
          return await image.save();
        })
      );
      imageIds = imageDocuments.map(img => img._id.toString());
    }

    // Extract variations if provided
    const variationsData = createProductDto.variations || [];
    delete createProductDto.variations;

    // Create product data with image IDs
    const productData = {
      ...createProductDto,
      images: imageIds,
    };

    const product = await this.productRepository.create(productData);

    // Create variations if provided (WooCommerce-style: create base product, then add variations)
    let variationIds: string[] = [];
    if (variationsData && variationsData.length > 0) {
      const variationDocuments = await Promise.all(
        variationsData.map(async (variationData) => {
          // Handle variation images if provided
          let variationImageIds: string[] = [];
          if (variationData.images && variationData.images.length > 0) {
            const variationImageDocuments = await Promise.all(
              variationData.images.map(async (imageData) => {
                const image = new this.productImageModel(imageData);
                return await image.save();
              })
            );
            variationImageIds = variationImageDocuments.map(img => img._id.toString());
          }

          const variation = new this.productVariationModel({
            productId: product._id,
            sku: variationData.sku,
            price: variationData.price,
            salePrice: variationData.comparePrice || variationData.salePrice,
            stockQuantity: variationData.stockQuantity || 0,
            stockStatus: variationData.stockStatus || 'outofstock',
            attributes: variationData.attributes || [],
            images: variationImageIds,
          });
          return await variation.save();
        })
      );
      variationIds = variationDocuments.map(v => v._id.toString());
    }

    // Update product with variation IDs
    if (variationIds.length > 0) {
      const updatedProduct = await this.productRepository.update(product._id.toString(), { variations: variationIds });
      // Sync to inventory after product creation
      await this.syncToInventory(updatedProduct);
      // Return populated product
      const populated = await this.productRepository.findById(updatedProduct._id.toString());
      return populated as any;
    }

    // Sync to inventory after product creation
    await this.syncToInventory(product);
    const populated = await this.productRepository.findById(product._id.toString());
    return populated as any;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<ProductDocument> {
    // Check if product exists
    await this.findById(id);

    // If updating slug, check for conflicts
    if (updateProductDto.slug) {
      const existingSlug = await this.productRepository.findBySlug(updateProductDto.slug);
      if (existingSlug && existingSlug._id.toString() !== id) {
        throw new ConflictException(`Product with slug '${updateProductDto.slug}' already exists`);
      }
    }

    // If updating SKU, check for conflicts
    if (updateProductDto.sku) {
      const existingSku = await this.productRepository.findBySku(updateProductDto.sku);
      if (existingSku && existingSku._id.toString() !== id) {
        throw new ConflictException(`Product with SKU '${updateProductDto.sku}' already exists`);
      }
    }

    // Validate sale price and auto-set isSale and originalPrice
    const currentProduct = await this.findById(id);
    // Product no longer has price directly - it's in ProductVariation
    // For now, we'll skip price validation if price is not in updateProductDto
    const price = updateProductDto.price !== undefined ? updateProductDto.price : 0;
    
    if (updateProductDto.salePrice !== undefined) {
      if (updateProductDto.salePrice >= price) {
        throw new BadRequestException('Sale price must be less than regular price');
      }
      
      // Auto-set isSale and originalPrice based on salePrice
      if (updateProductDto.salePrice > 0 && updateProductDto.salePrice < price) {
        updateProductDto.isSale = true;
        // Product no longer has originalPrice - it's in ProductVariation
        // Skip originalPrice handling for now
      } else if (updateProductDto.salePrice === 0 || updateProductDto.salePrice === null) {
        // If sale price is removed, set isSale to false
        updateProductDto.isSale = false;
      }
    } else if (updateProductDto.price !== undefined) {
      // If price is updated but salePrice is not, check if salePrice still makes sense
      // Product no longer has salePrice - it's in ProductVariation
      const currentSalePrice = 0;
      if (currentSalePrice && currentSalePrice > 0 && currentSalePrice < price) {
        // Sale price is still valid, ensure isSale is true
        updateProductDto.isSale = true;
        // Product no longer has originalPrice - it's in ProductVariation
        // Skip originalPrice handling for now
      } else if (currentSalePrice && currentSalePrice >= price) {
        // Sale price is no longer valid, remove it
        updateProductDto.isSale = false;
      }
    }

    // Auto-update stock status if stock quantity is being updated
    const manageStock = updateProductDto.manageStock !== undefined 
      ? updateProductDto.manageStock 
      : currentProduct.manageStock;
    const allowBackorders = updateProductDto.allowBackorders !== undefined 
      ? updateProductDto.allowBackorders 
      : currentProduct.allowBackorders;
    
    // Product no longer has stockQuantity/stockStatus - these are in ProductVariation
    // Skip stock status handling for now
    if (manageStock) {
      // Default to in stock if managing stock
      updateProductDto.inStock = true;
    } else {
      // If not managing stock, default to in stock
      updateProductDto.inStock = true;
    }

    // Handle image updates if provided
    let imageIds: string[] | undefined;
    if (updateProductDto.images && updateProductDto.images.length > 0) {
      const imageDocuments = await Promise.all(
        updateProductDto.images.map(async (imageData) => {
          const image = new this.productImageModel(imageData);
          return await image.save();
        })
      );
      imageIds = imageDocuments.map(img => img._id.toString());
    }

    // Extract variations if provided
    const variationsData = updateProductDto.variations || [];
    delete updateProductDto.variations;

    // Create update data with image IDs if provided
    const updateData = {
      ...updateProductDto,
      ...(imageIds && { images: imageIds }),
    };

    // Update the base product
    const updatedProduct = await this.productRepository.update(id, updateData);

    // Handle variations if provided
    if (variationsData && variationsData.length > 0) {
      // Delete existing variations for this product (optional, depending on requirements)
      // await this.productVariationModel.deleteMany({ productId: id });

      // Create new variations
      const variationDocuments = await Promise.all(
        variationsData.map(async (variationData) => {
          // Handle variation images if provided
          let variationImageIds: string[] = [];
          if (variationData.images && variationData.images.length > 0) {
            const variationImageDocuments = await Promise.all(
              variationData.images.map(async (imageData) => {
                const image = new this.productImageModel(imageData);
                return await image.save();
              })
            );
            variationImageIds = variationImageDocuments.map(img => img._id.toString());
          }

          // If variation has an ID, update it, otherwise create new
          if (variationData._id) {
            return await this.productVariationModel.findByIdAndUpdate(
              variationData._id,
              {
                ...variationData,
                productId: id,
                images: variationImageIds.length > 0 ? variationImageIds : undefined,
              },
              { new: true }
            );
          } else {
            const variation = new this.productVariationModel({
              productId: id,
              sku: variationData.sku,
              price: variationData.price,
              salePrice: variationData.comparePrice || variationData.salePrice,
              stockQuantity: variationData.stockQuantity || 0,
              stockStatus: variationData.stockStatus || 'outofstock',
              attributes: variationData.attributes || [],
              images: variationImageIds,
            });
            return await variation.save();
          }
        })
      );
      
      const variationIds = variationDocuments.map(v => v._id.toString());
      
      // Update product with variation IDs
      const finalProduct = await this.productRepository.update(id, { variations: variationIds });
      // Sync to inventory after product update
      await this.syncToInventory(finalProduct, updateProductDto);
      const populatedFinal = await this.productRepository.findById(finalProduct._id.toString());
      return populatedFinal as any;
    }

    // Sync to inventory after product update (if inventory-related fields changed)
    if (updateProductDto.stockQuantity !== undefined || 
        updateProductDto.stockStatus !== undefined || 
        updateProductDto.price !== undefined ||
        updateProductDto.originalPrice !== undefined) {
      await this.syncToInventory(updatedProduct, updateProductDto);
    }
    const populatedUpdated = await this.productRepository.findById(updatedProduct._id.toString());
    return populatedUpdated as any;
  }

  async findBySlug(slug: string): Promise<ProductDocument> {
    try {
      const product = await this.productRepository.findBySlug(slug);
      if (!product) {
        throw new NotFoundException(`Product with slug '${slug}' not found`);
      }
      return product;
    } catch (error) {
      // If it's already a NestJS HTTP exception, re-throw it
      if (error instanceof NotFoundException || error.status) {
        throw error;
      }
      // Otherwise, log and wrap in NotFoundException
      console.error(`Error finding product by slug '${slug}':`, error);
      throw new NotFoundException(`Product with slug '${slug}' not found`);
    }
  }

  async findByCategory(categoryId: string, options?: PaginationOptions): Promise<PaginatedResult<ProductDocument>> {
    return await this.productRepository.findByCategory(categoryId, options);
  }

  async findByBrand(brandId: string, options?: PaginationOptions): Promise<PaginatedResult<ProductDocument>> {
    return await this.productRepository.findByBrand(brandId, options);
  }

  async searchProducts(query: string, options?: PaginationOptions): Promise<PaginatedResult<ProductDocument>> {
    if (!query || query.trim().length < 2) {
      throw new BadRequestException('Search query must be at least 2 characters long');
    }
    return await this.productRepository.searchProducts(query, options);
  }

  async findPublishedProducts(options?: PaginationOptions): Promise<PaginatedResult<ProductDocument>> {
    return await this.productRepository.findPublishedProducts(options);
  }

  async updateStock(id: string, quantity: number): Promise<ProductDocument> {
    const product = await this.findById(id);
    
    if (!product.manageStock) {
      throw new BadRequestException('Stock management is not enabled for this product');
    }

    // Product no longer has stockQuantity/stockStatus - these are in ProductVariation
    // This method needs to be refactored to work with variations
    // For now, we'll update the first variation if it exists
    const variations = await this.productVariationModel.find({ productId: id }).exec();
    if (variations.length === 0) {
      throw new BadRequestException('Product has no variations to adjust stock');
    }

    const variation = variations[0];
    const newQuantity = variation.stockQuantity + quantity;
    let stockStatus = variation.stockStatus;

    if (newQuantity > 0) {
      stockStatus = VariationStockStatus.INSTOCK;
    } else {
      stockStatus = VariationStockStatus.OUTOFSTOCK;
    }

    variation.stockQuantity = Math.max(0, newQuantity);
    variation.stockStatus = stockStatus;
    await variation.save();

    // Sync to inventory
    await this.syncToInventory(product);

    return await this.findById(id);
  }

  // Public method to sync inventory data to product (used by InventoryService)
  async syncInventoryToProduct(productId: string, inventoryData: {
    stockQuantity?: number;
    status?: string;
  }): Promise<ProductDocument> {
    // Product no longer has stockQuantity/stockStatus - these are in ProductVariation
    // This method needs to be refactored to work with variations
    // For now, we'll update the first variation if it exists
    const variations = await this.productVariationModel.find({ productId }).exec();
    if (variations.length > 0 && inventoryData.stockQuantity !== undefined) {
      const variation = variations[0];
      variation.stockQuantity = inventoryData.stockQuantity;
      if (inventoryData.status) {
        variation.stockStatus = inventoryData.status === 'in_stock' 
          ? VariationStockStatus.INSTOCK 
          : VariationStockStatus.OUTOFSTOCK;
      }
      await variation.save();
    }

    return await this.findById(productId);
  }

  async getFilterOptions(): Promise<{
    categories: Array<{ _id: string; name: string; slug: string }>;
    brands: Array<{ _id: string; name: string; slug: string }>;
    sizes: string[];
    colors: string[];
    priceRange: { min: number; max: number };
  }> {
    return await this.productRepository.getFilterOptions();
  }
} 