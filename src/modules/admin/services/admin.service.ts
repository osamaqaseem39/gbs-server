import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Admin, AdminDocument } from '../schemas/admin.schema';
import { User, UserDocument } from '../../user/schemas/user.schema';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto): Promise<Admin> {
    const { email, password, firstName, lastName, role = 'admin' } = createAdminDto;

    // Check if user with email already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user first
    const user = new this.userModel({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      userType: 'admin',
      isActive: true,
      emailVerified: false,
    });
    await user.save();

    // Create admin with reference to user
    const admin = new this.adminModel({
      userId: user._id,
      role,
    });

    return await admin.save();
  }

  async authenticate(email: string, password: string): Promise<{ user: any; token: string }> {
    // Find user by email
    const user = await this.userModel.findOne({ email, userType: 'admin' });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Find admin by userId
    const admin = await this.adminModel.findOne({ userId: user._id }).populate('userId');
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate JWT token
    const payload = {
      sub: admin._id,
      email: user.email,
      role: admin.role,
    };

    const token = this.jwtService.sign(payload);

    // Return admin with user data
    const adminResponse = {
      _id: admin._id,
      userId: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: admin.role,
      permissions: admin.permissions,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      lastLoginAt: user.lastLoginAt,
    };

    return {
      user: adminResponse,
      token,
    };
  }

  async findById(id: string): Promise<any> {
    const admin = await this.adminModel.findById(id).populate('userId');
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    const user = admin.userId as any;
    return {
      _id: admin._id,
      userId: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: admin.role,
      permissions: admin.permissions,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
    };
  }

  async findByEmail(email: string): Promise<any> {
    const user = await this.userModel.findOne({ email, userType: 'admin' });
    if (!user) {
      throw new NotFoundException('Admin not found');
    }
    const admin = await this.adminModel.findOne({ userId: user._id }).populate('userId');
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    const populatedUser = admin.userId as any;
    return {
      _id: admin._id,
      userId: populatedUser._id,
      email: populatedUser.email,
      firstName: populatedUser.firstName,
      lastName: populatedUser.lastName,
      role: admin.role,
      permissions: admin.permissions,
      isActive: populatedUser.isActive,
      emailVerified: populatedUser.emailVerified,
    };
  }

  async updatePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    const admin = await this.adminModel.findById(id).populate('userId');
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    const user = admin.userId as any;
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password in user
    user.password = hashedNewPassword;
    user.passwordChangedAt = new Date();
    await user.save();
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email, userType: 'admin' });
    if (!user) {
      // Don't reveal if email exists or not
      return;
    }

    const admin = await this.adminModel.findOne({ userId: user._id });
    if (!admin) {
      return;
    }

    // Generate reset token
    const resetToken = this.generateRandomToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // TODO: Send email with reset token
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
      userType: 'admin',
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.passwordChangedAt = new Date();
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  }

  private generateRandomToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
} 