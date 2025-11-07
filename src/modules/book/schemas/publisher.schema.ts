import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PublisherDocument = Publisher & Document;

@Schema({ timestamps: true })
export class Publisher {
  @ApiProperty({ description: 'Publisher ID' })
  _id: string;

  @ApiProperty({ description: 'Publisher name' })
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty({ description: 'Publisher slug' })
  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @ApiProperty({ description: 'Publisher description' })
  @Prop()
  description?: string;

  @ApiProperty({ description: 'Website' })
  @Prop()
  website?: string;

  @ApiProperty({ description: 'Email' })
  @Prop()
  email?: string;

  @ApiProperty({ description: 'Phone' })
  @Prop()
  phone?: string;

  @ApiProperty({ description: 'Address' })
  @Prop({
    type: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
  })
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };

  @ApiProperty({ description: 'Founded year' })
  @Prop()
  foundedYear?: number;

  @ApiProperty({ description: 'Logo URL' })
  @Prop()
  logoUrl?: string;

  @ApiProperty({ description: 'Is active' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Total books count' })
  @Prop({ min: 0, default: 0 })
  booksCount: number;

  @ApiProperty({ description: 'Specialties' })
  @Prop({ type: [String] })
  specialties?: string[];

  @ApiProperty({ description: 'Imprint names' })
  @Prop({ type: [String] })
  imprints?: string[];

  createdAt: Date;
  updatedAt: Date;
}

export const PublisherSchema = SchemaFactory.createForClass(Publisher);

PublisherSchema.index({ slug: 1 }, { unique: true });
PublisherSchema.index({ name: 1 });
PublisherSchema.index({ isActive: 1 });