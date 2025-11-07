import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type AuthorDocument = Author & Document;

@Schema({ timestamps: true })
export class Author {
  @ApiProperty({ description: 'Author ID' })
  _id: string;

  @ApiProperty({ description: 'Author name' })
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty({ description: 'Author slug' })
  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @ApiProperty({ description: 'Biography' })
  @Prop()
  biography?: string;

  @ApiProperty({ description: 'Date of birth' })
  @Prop()
  dateOfBirth?: Date;

  @ApiProperty({ description: 'Date of death' })
  @Prop()
  dateOfDeath?: Date;

  @ApiProperty({ description: 'Nationality' })
  @Prop()
  nationality?: string;

  @ApiProperty({ description: 'Website' })
  @Prop()
  website?: string;

  @ApiProperty({ description: 'Social media links' })
  @Prop({
    type: {
      twitter: String,
      facebook: String,
      instagram: String,
      linkedin: String,
    },
  })
  socialMedia?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };

  @ApiProperty({ description: 'Author photo URL' })
  @Prop()
  photoUrl?: string;

  @ApiProperty({ description: 'Is active' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Total books count' })
  @Prop({ min: 0, default: 0 })
  booksCount: number;

  @ApiProperty({ description: 'Awards' })
  @Prop({ type: [String] })
  awards?: string[];

  @ApiProperty({ description: 'Genres' })
  @Prop({ type: [String] })
  genres?: string[];

  createdAt: Date;
  updatedAt: Date;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);

AuthorSchema.index({ slug: 1 }, { unique: true });
AuthorSchema.index({ name: 1 });
AuthorSchema.index({ isActive: 1 });