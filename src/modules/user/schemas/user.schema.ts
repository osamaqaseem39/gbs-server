import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ description: 'User ID' })
  _id: string;

  @ApiProperty({ description: 'Email address' })
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @ApiProperty({ description: 'Hashed password' })
  @Prop({ required: true })
  password: string;

  @ApiProperty({ description: 'First name' })
  @Prop({ required: true, trim: true })
  firstName: string;

  @ApiProperty({ description: 'Last name' })
  @Prop({ required: true, trim: true })
  lastName: string;

  @ApiProperty({ description: 'Phone number' })
  @Prop({ trim: true })
  phone?: string;

  @ApiProperty({ description: 'Date of birth' })
  @Prop()
  dateOfBirth?: Date;

  @ApiProperty({ description: 'Whether user is active' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Whether email is verified' })
  @Prop({ default: false })
  emailVerified: boolean;

  @ApiProperty({ description: 'Last login timestamp' })
  @Prop()
  lastLoginAt?: Date;

  @ApiProperty({ enum: ['customer', 'admin'], description: 'User type' })
  @Prop({ required: true, enum: ['customer', 'admin'] })
  userType: 'customer' | 'admin';

  @ApiProperty({ description: 'Password reset token' })
  @Prop()
  resetPasswordToken?: string;

  @ApiProperty({ description: 'Password reset token expiry' })
  @Prop()
  resetPasswordExpires?: Date;

  @ApiProperty({ description: 'Email verification token' })
  @Prop()
  emailVerificationToken?: string;

  @ApiProperty({ description: 'Email verification token expiry' })
  @Prop()
  emailVerificationExpires?: Date;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ userType: 1, isActive: 1 });
UserSchema.index({ emailVerificationToken: 1 });
UserSchema.index({ resetPasswordToken: 1 });
UserSchema.index({ createdAt: -1 });

