import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { Supplier, SupplierDocument } from '../schemas/supplier.schema';

@Injectable()
export class SupplierRepository extends BaseRepository<SupplierDocument> {
  constructor(
    @InjectModel(Supplier.name) private readonly supplierModel: Model<SupplierDocument>,
  ) {
    super(supplierModel);
  }

  async findByCode(code: string): Promise<SupplierDocument | null> {
    return this.supplierModel.findOne({ code }).exec();
  }

  async findActiveSuppliers(): Promise<SupplierDocument[]> {
    return this.supplierModel.find({ isActive: true }).sort({ name: 1 }).exec();
  }

  async findByRating(minRating: number): Promise<SupplierDocument[]> {
    return this.supplierModel.find({ 
      rating: { $gte: minRating },
      isActive: true 
    }).sort({ rating: -1 }).exec();
  }

  async searchSuppliers(searchTerm: string): Promise<SupplierDocument[]> {
    return this.supplierModel.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { code: { $regex: searchTerm, $options: 'i' } },
        { contactPerson: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
      ],
      isActive: true,
    }).sort({ name: 1 }).exec();
  }
}