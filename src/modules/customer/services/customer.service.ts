import { Injectable, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from '../../../common/services/base.service';
import { CustomerRepository } from '../repositories/customer.repository';
import { CustomerDocument } from '../schemas/customer.schema';
import { User, UserDocument } from '../../user/schemas/user.schema';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomerService extends BaseService<CustomerDocument> {
  constructor(
    private readonly customerRepository: CustomerRepository,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super(customerRepository);
  }

  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<CustomerDocument> {
    // Check if customer with same email already exists
    const existingCustomer = await this.customerRepository.findByEmail(createCustomerDto.email);
    if (existingCustomer) {
      throw new ConflictException(`Customer with email '${createCustomerDto.email}' already exists`);
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(createCustomerDto.password, saltRounds);

    // Create user first
    const user = new this.userModel({
      email: createCustomerDto.email,
      password: passwordHash,
      firstName: createCustomerDto.firstName,
      lastName: createCustomerDto.lastName,
      phone: createCustomerDto.phone,
      userType: 'customer',
      isActive: true,
      emailVerified: false,
    });
    await user.save();

    // Create customer with reference to user
    const customerData: any = {};
    if (createCustomerDto.billingAddress) {
      customerData.billingAddress = createCustomerDto.billingAddress;
    }
    if (createCustomerDto.shippingAddress) {
      customerData.shippingAddress = createCustomerDto.shippingAddress;
    }

    return await this.customerRepository.create({
      userId: user._id,
      ...customerData,
    });
  }

  async updateCustomer(id: string, updateCustomerDto: UpdateCustomerDto): Promise<CustomerDocument> {
    // Check if customer exists
    const customer = await this.findById(id);
    const customerDoc = customer as any;

    // If updating email, check for conflicts
    if (updateCustomerDto.email) {
      const existingCustomer = await this.customerRepository.findByEmail(updateCustomerDto.email);
      if (existingCustomer && existingCustomer._id.toString() !== id) {
        throw new ConflictException(`Customer with email '${updateCustomerDto.email}' already exists`);
      }
    }

    // Update user if email, firstName, lastName, phone are provided
    if (customerDoc.userId) {
      const userUpdate: any = {};
      if (updateCustomerDto.email) userUpdate.email = updateCustomerDto.email;
      if (updateCustomerDto.firstName) userUpdate.firstName = updateCustomerDto.firstName;
      if (updateCustomerDto.lastName) userUpdate.lastName = updateCustomerDto.lastName;
      if (updateCustomerDto.phone !== undefined) userUpdate.phone = updateCustomerDto.phone;
      
      if (Object.keys(userUpdate).length > 0) {
        await this.userModel.findByIdAndUpdate(customerDoc.userId, userUpdate);
      }
    }

    // Update customer-specific fields
    const customerUpdate: any = {};
    if (updateCustomerDto.billingAddress) customerUpdate.billingAddress = updateCustomerDto.billingAddress;
    if (updateCustomerDto.shippingAddress) customerUpdate.shippingAddress = updateCustomerDto.shippingAddress;

    if (Object.keys(customerUpdate).length > 0) {
      return await this.customerRepository.update(id, customerUpdate);
    }

    return customer;
  }

  async findByEmail(email: string): Promise<CustomerDocument> {
    const customer = await this.customerRepository.findByEmail(email);
    if (!customer) {
      throw new Error(`Customer with email '${email}' not found`);
    }
    return customer;
  }

  async authenticate(email: string, password: string): Promise<CustomerDocument> {
    const customer = await this.customerRepository.findByEmail(email);
    if (!customer) {
      throw new BadRequestException('Invalid credentials');
    }

    const customerDoc = customer as any;
    const user = customerDoc.userId;
    if (!user || !user.password) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    return customer;
  }

  async updatePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    const customer = await this.findById(id);
    const customerDoc = customer as any;
    
    if (!customerDoc.userId) {
      throw new BadRequestException('User not found');
    }

    const user = await this.userModel.findById(customerDoc.userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    await this.userModel.findByIdAndUpdate(customerDoc.userId, { password: newPasswordHash });
  }

  async findByName(firstName: string, lastName: string): Promise<CustomerDocument[]> {
    return await this.customerRepository.findByName(firstName, lastName);
  }

  async findByResetToken(token: string): Promise<CustomerDocument | null> {
    return await this.customerRepository.findByResetToken(token);
  }
} 