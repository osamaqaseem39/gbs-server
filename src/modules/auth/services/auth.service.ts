import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomerService } from '../../customer/services/customer.service';
import { RegisterDto } from '../dto/register.dto';
import { Customer } from '../../customer/schemas/customer.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if customer already exists
    try {
      const existingCustomer = await this.customerService.findByEmail(registerDto.email);
      if (existingCustomer) {
        throw new ConflictException('Customer with this email already exists');
      }
    } catch (error) {
      if (error.message && error.message.includes('not found')) {
        // Customer doesn't exist, continue
      } else {
        throw error;
      }
    }

    // Create customer (service will handle user creation)
    const customer = await this.customerService.createCustomer(registerDto);

    // Get populated customer with user data
    const customerWithUser = customer as any;
    const user = customerWithUser.userId;

    // Generate tokens
    const tokens = await this.generateTokens(customer);

    return {
      user: {
        _id: customer._id,
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        isActive: user?.isActive || false,
        emailVerified: user?.emailVerified || false,
        createdAt: customer.createdAt,
      },
      ...tokens,
    };
  }

  async validateCustomer(email: string, password: string): Promise<Customer> {
    const customer = await this.customerService.findByEmail(email);
    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const customerDoc = customer as any;
    const user = customerDoc.userId;
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return customer;
  }

  async login(customer: Customer) {
    const tokens = await this.generateTokens(customer);

    // Update last login - need to update user, not customer
    const customerDoc = customer as any;
    if (customerDoc.userId) {
      await this.customerService.updateCustomer(customer._id, {
        lastLoginAt: new Date(),
      } as any);
    }

    const customerWithUser = customer as any;
    const user = customerWithUser.userId;

    return {
      user: {
        _id: customer._id,
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        isActive: user?.isActive || false,
        emailVerified: user?.emailVerified || false,
        lastLoginAt: user?.lastLoginAt,
      },
      ...tokens,
    };
  }

  async getProfile(customerId: string) {
    const customer = await this.customerService.findById(customerId);
    if (!customer) {
      throw new UnauthorizedException('Customer not found');
    }

    const customerDoc = customer as any;
    const user = customerDoc.userId;

    return {
      _id: customer._id,
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth,
      isActive: user?.isActive || false,
      emailVerified: user?.emailVerified || false,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }

  async refreshToken(customer: any) {
    const fullCustomer = await this.customerService.findById(customer.sub);
    if (!fullCustomer) {
      throw new UnauthorizedException('Customer not found');
    }

    return await this.generateTokens(fullCustomer);
  }

  async logout(customerId: string) {
    // In a real implementation, you might want to blacklist the token
    // For now, we'll just return success
    return { success: true };
  }

  async forgotPassword(email: string) {
    const customer = await this.customerService.findByEmail(email);
    if (!customer) {
      // Don't reveal if email exists or not
      return;
    }

    // Generate reset token (in production, use crypto.randomBytes)
    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await this.customerService.updateCustomer(customer._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry,
    });

    // TODO: Send email with reset link
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }

  async resetPassword(token: string, newPassword: string) {
    const customer = await this.customerService.findByResetToken(token);
    if (!customer) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const customerDoc = customer as any;
    const user = customerDoc.userId;
    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update password through customer service which will update user
    await this.customerService.updatePassword(customer._id, user.password, newPassword);
  }

  private async generateTokens(customer: Customer) {
    const customerDoc = customer as any;
    const user = customerDoc.userId;

    const payload = {
      sub: customer._id,
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
    };
  }
}
