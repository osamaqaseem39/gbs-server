import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type BookSeriesDocument = BookSeries & Document;

@Schema({ timestamps: true })
export class BookSeries {
  @ApiProperty({ description: 'Series ID' })
  _id: string;

  @ApiProperty({ description: 'Series name' })
  @Prop({ required: true, trim: true })
  name: string;

  @ApiProperty({ description: 'Series slug' })
  @Prop({ required: true, unique: true, trim: true })
  slug: string;

  @ApiProperty({ description: 'Series description' })
  @Prop()
  description?: string;

  @ApiProperty({ description: 'Author ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Author' })
  authorId?: string;

  @ApiProperty({ description: 'Publisher ID' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Publisher' })
  publisherId?: string;

  @ApiProperty({ description: 'Genre' })
  @Prop()
  genre?: string;

  @ApiProperty({ description: 'Target age group' })
  @Prop()
  ageGroup?: string;

  @ApiProperty({ description: 'Total books in series' })
  @Prop({ min: 0, default: 0 })
  totalBooks: number;

  @ApiProperty({ description: 'Is ongoing series' })
  @Prop({ default: true })
  isOngoing: boolean;

  @ApiProperty({ description: 'First published year' })
  @Prop()
  firstPublishedYear?: number;

  @ApiProperty({ description: 'Last published year' })
  @Prop()
  lastPublishedYear?: number;

  @ApiProperty({ description: 'Cover image URL' })
  @Prop()
  coverImageUrl?: string;

  @ApiProperty({ description: 'Is active' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Books in series' })
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Product' })
  bookIds?: string[];

  @ApiProperty({ description: 'Series order' })
  @Prop({ type: [Object] })
  seriesOrder?: Array<{
    bookId: string;
    order: number;
    title: string;
  }>;

  createdAt: Date;
  updatedAt: Date;
}

export const BookSeriesSchema = SchemaFactory.createForClass(BookSeries);

BookSeriesSchema.index({ slug: 1 }, { unique: true });
BookSeriesSchema.index({ name: 1 });
BookSeriesSchema.index({ authorId: 1 });
BookSeriesSchema.index({ publisherId: 1 });
BookSeriesSchema.index({ isActive: 1 });