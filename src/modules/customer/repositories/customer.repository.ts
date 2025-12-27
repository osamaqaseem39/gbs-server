import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { Customer, CustomerDocument } from '../schemas/customer.schema';
import { User, UserDocument } from '../../user/schemas/user.schema';

@Injectable()
export class CustomerRepository extends BaseRepository<CustomerDocument> {
  constructor(
    @InjectModel(Customer.name) private readonly customerModel: Model<CustomerDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super(customerModel);
  }

  async findByEmail(email: string): Promise<CustomerDocument | null> {
    const user = await this.userModel.findOne({ email: email.toLowerCase(), userType: 'customer' }).exec();
    if (!user) {
      return null;
    }
    return await this.customerModel.findOne({ userId: user._id }).populate('userId').exec();
  }

  async findByEmailAndPassword(email: string, password: string): Promise<CustomerDocument | null> {
    const user = await this.userModel.findOne({
      email: email.toLowerCase(),
      password,
      userType: 'customer',
    }).exec();
    if (!user) {
      return null;
    }
    return await this.customerModel.findOne({ userId: user._id }).populate('userId').exec();
  }

  async findByName(firstName: string, lastName: string): Promise<CustomerDocument[]> {
    const users = await this.userModel
      .find({
        userType: 'customer',
        $or: [
          { firstName: { $regex: firstName, $options: 'i' } },
          { lastName: { $regex: lastName, $options: 'i' } },
        ],
      })
      .exec();
    
    const userIds = users.map(u => u._id);
    return await this.customerModel.find({ userId: { $in: userIds } }).populate('userId').exec();
  }

  async findByResetToken(token: string): Promise<CustomerDocument | null> {
    const user = await this.userModel.findOne({ 
      resetPasswordToken: token,
      userType: 'customer',
    }).exec();
    if (!user) {
      return null;
    }
    return await this.customerModel.findOne({ userId: user._id }).populate('userId').exec();
  }
} 