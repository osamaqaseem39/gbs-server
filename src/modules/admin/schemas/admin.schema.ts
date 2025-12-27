import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
  @ApiProperty({ description: 'Admin ID' })
  _id: string;

  @ApiProperty({ description: 'User ID (reference to User entity)' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User', unique: true })
  userId: string;

  @ApiProperty({ enum: ['admin', 'super_admin'], description: 'Admin role' })
  @Prop({ required: true, enum: ['admin', 'super_admin'], default: 'admin' })
  role: 'admin' | 'super_admin';

  @ApiProperty({ description: 'Permissions array' })
  @Prop({ type: [String], default: [] })
  permissions?: string[];

  @ApiProperty({ description: 'Password changed timestamp' })
  @Prop()
  passwordChangedAt?: Date;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

// Indexes
AdminSchema.index({ userId: 1 });
AdminSchema.index({ role: 1 });
AdminSchema.index({ createdAt: -1 }); 