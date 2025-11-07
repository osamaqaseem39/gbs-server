import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { CustomerGroup, CustomerGroupDocument } from '../schemas/customer-group.schema';

@Injectable()
export class CustomerGroupRepository extends BaseRepository<CustomerGroupDocument> {
  constructor(
    @InjectModel(CustomerGroup.name) private readonly customerGroupModel: Model<CustomerGroupDocument>,
  ) {
    super(customerGroupModel);
  }

  async findByCode(code: string): Promise<CustomerGroupDocument | null> {
    return this.customerGroupModel.findOne({ code }).exec();
  }

  async findActiveGroups(): Promise<CustomerGroupDocument[]> {
    return this.customerGroupModel.find({ isActive: true }).sort({ priority: -1 }).exec();
  }

  async findByPriority(priority: number): Promise<CustomerGroupDocument[]> {
    return this.customerGroupModel.find({ 
      priority: { $gte: priority },
      isActive: true 
    }).sort({ priority: -1 }).exec();
  }

  async searchGroups(searchTerm: string): Promise<CustomerGroupDocument[]> {
    return this.customerGroupModel.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { code: { $regex: searchTerm, $options: 'i' } },
      ],
      isActive: true,
    }).sort({ priority: -1 }).exec();
  }

  async incrementMembersCount(groupId: string): Promise<CustomerGroupDocument | null> {
    return this.customerGroupModel.findByIdAndUpdate(
      groupId,
      { $inc: { membersCount: 1 } },
      { new: true }
    ).exec();
  }

  async decrementMembersCount(groupId: string): Promise<CustomerGroupDocument | null> {
    return this.customerGroupModel.findByIdAndUpdate(
      groupId,
      { $inc: { membersCount: -1 } },
      { new: true }
    ).exec();
  }

  async getGroupStats(): Promise<any> {
    const totalGroups = await this.customerGroupModel.countDocuments();
    const activeGroups = await this.customerGroupModel.countDocuments({ isActive: true });
    
    const totalMembers = await this.customerGroupModel.aggregate([
      { $group: { _id: null, total: { $sum: '$membersCount' } } }
    ]);

    return {
      totalGroups,
      activeGroups,
      totalMembers: totalMembers.length > 0 ? totalMembers[0].total : 0,
    };
  }
}