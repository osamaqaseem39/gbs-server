import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../../common/services/base.service';
import { Supplier } from '../schemas/supplier.schema';
import { SupplierRepository } from '../repositories/supplier.repository';

@Injectable()
export class SupplierService extends BaseService<Supplier> {
  constructor(private readonly supplierRepository: SupplierRepository) {
    super(supplierRepository);
  }

  async findByCode(code: string): Promise<Supplier> {
    const supplier = await this.supplierRepository.findByCode(code);
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }
    return supplier;
  }

  async findActiveSuppliers(): Promise<Supplier[]> {
    return this.supplierRepository.findActiveSuppliers();
  }

  async findByRating(minRating: number): Promise<Supplier[]> {
    return this.supplierRepository.findByRating(minRating);
  }

  async searchSuppliers(searchTerm: string): Promise<Supplier[]> {
    return this.supplierRepository.searchSuppliers(searchTerm);
  }

  async getSupplierStats(): Promise<any> {
    const totalSuppliers = await this.supplierRepository.findAll();
    const activeSuppliers = await this.findActiveSuppliers();
    const topRatedSuppliers = await this.findByRating(4);
    
    return {
      totalSuppliers: totalSuppliers.data.length,
      activeSuppliers: activeSuppliers.length,
      topRatedSuppliers: topRatedSuppliers.length,
      averageRating: activeSuppliers.reduce((sum, s) => sum + (s.rating || 0), 0) / activeSuppliers.length || 0,
    };
  }
}