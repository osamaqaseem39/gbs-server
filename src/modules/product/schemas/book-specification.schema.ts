import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type BookSpecificationDocument = BookSpecification & Document;

export enum BookFormat {
  HARDCOVER = 'hardcover',
  PAPERBACK = 'paperback',
  EBOOK = 'ebook',
  AUDIOBOOK = 'audiobook',
}

export enum BookLanguage {
  ENGLISH = 'english',
  HINDI = 'hindi',
  BENGALI = 'bengali',
  TAMIL = 'tamil',
  TELUGU = 'telugu',
  MARATHI = 'marathi',
  GUJARATI = 'gujarati',
  KANNADA = 'kannada',
  MALAYALAM = 'malayalam',
  PUNJABI = 'punjabi',
}

export enum BookSubject {
  MATHEMATICS = 'mathematics',
  SCIENCE = 'science',
  ENGLISH = 'english',
  HINDI = 'hindi',
  SOCIAL_STUDIES = 'social_studies',
  HISTORY = 'history',
  GEOGRAPHY = 'geography',
  PHYSICS = 'physics',
  CHEMISTRY = 'chemistry',
  BIOLOGY = 'biology',
  COMPUTER_SCIENCE = 'computer_science',
  ECONOMICS = 'economics',
  COMMERCE = 'commerce',
  ACCOUNTANCY = 'accountancy',
  BUSINESS_STUDIES = 'business_studies',
  LITERATURE = 'literature',
  PHILOSOPHY = 'philosophy',
  PSYCHOLOGY = 'psychology',
  POLITICAL_SCIENCE = 'political_science',
  SOCIOLOGY = 'sociology',
}

@Schema({ timestamps: true })
export class BookSpecification {
  @ApiProperty({ description: 'Book specification ID' })
  _id: string;

  @ApiProperty({ description: 'Product ID reference' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  productId: string;

  @ApiProperty({ description: 'ISBN' })
  @Prop({ unique: true, sparse: true })
  isbn?: string;

  @ApiProperty({ description: 'ISBN-13' })
  @Prop({ unique: true, sparse: true })
  isbn13?: string;

  @ApiProperty({ description: 'ISBN-10' })
  @Prop({ unique: true, sparse: true })
  isbn10?: string;

  @ApiProperty({ enum: BookFormat, description: 'Book format' })
  @Prop({ required: true, enum: BookFormat })
  format: BookFormat;

  @ApiProperty({ enum: BookLanguage, description: 'Primary language' })
  @Prop({ required: true, enum: BookLanguage })
  language: BookLanguage;

  @ApiProperty({ description: 'Number of pages' })
  @Prop({ min: 1 })
  pageCount?: number;

  @ApiProperty({ description: 'Book dimensions (length x width x height in cm)' })
  @Prop({
    type: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
    },
  })
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };

  @ApiProperty({ description: 'Book weight in grams' })
  @Prop({ min: 0 })
  weight?: number;

  @ApiProperty({ description: 'Publication date' })
  @Prop()
  publicationDate?: Date;

  @ApiProperty({ description: 'Edition' })
  @Prop()
  edition?: string;

  @ApiProperty({ description: 'Volume number' })
  @Prop()
  volume?: string;

  @ApiProperty({ description: 'Series name' })
  @Prop()
  seriesName?: string;

  @ApiProperty({ description: 'Series number' })
  @Prop()
  seriesNumber?: number;

  @ApiProperty({ description: 'Age group/Reading level' })
  @Prop()
  ageGroup?: string;

  @ApiProperty({ description: 'Grade level' })
  @Prop()
  gradeLevel?: string;

  @ApiProperty({ enum: BookSubject, description: 'Subject category' })
  @Prop({ enum: BookSubject })
  subject?: BookSubject;

  @ApiProperty({ description: 'Board/Curriculum (CBSE, ICSE, State Board, etc.)' })
  @Prop()
  board?: string;

  @ApiProperty({ description: 'Syllabus year' })
  @Prop()
  syllabusYear?: string;

  @ApiProperty({ description: 'Author names' })
  @Prop({ type: [String] })
  authors?: string[];

  @ApiProperty({ description: 'Editor names' })
  @Prop({ type: [String] })
  editors?: string[];

  @ApiProperty({ description: 'Illustrator names' })
  @Prop({ type: [String] })
  illustrators?: string[];

  @ApiProperty({ description: 'Publisher name' })
  @Prop()
  publisher?: string;

  @ApiProperty({ description: 'Publisher ID reference' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Publisher' })
  publisherId?: string;

  @ApiProperty({ description: 'Author ID reference' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Author' })
  authorId?: string;

  @ApiProperty({ description: 'Book series ID reference' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'BookSeries' })
  bookSeriesId?: string;

  @ApiProperty({ description: 'Table of contents' })
  @Prop()
  tableOfContents?: string;

  @ApiProperty({ description: 'Book description/Summary' })
  @Prop()
  summary?: string;

  @ApiProperty({ description: 'Key features' })
  @Prop({ type: [String] })
  keyFeatures?: string[];

  @ApiProperty({ description: 'Learning objectives' })
  @Prop({ type: [String] })
  learningObjectives?: string[];

  @ApiProperty({ description: 'Prerequisites' })
  @Prop()
  prerequisites?: string;

  @ApiProperty({ description: 'Target audience' })
  @Prop()
  targetAudience?: string;

  @ApiProperty({ description: 'Book cover image URL' })
  @Prop()
  coverImageUrl?: string;

  @ApiProperty({ description: 'Sample pages images' })
  @Prop({ type: [String] })
  samplePages?: string[];

  @ApiProperty({ description: 'Is digital version available' })
  @Prop({ default: false })
  hasDigitalVersion: boolean;

  @ApiProperty({ description: 'Is audio version available' })
  @Prop({ default: false })
  hasAudioVersion: boolean;

  @ApiProperty({ description: 'Digital format URLs' })
  @Prop({ type: MongooseSchema.Types.Mixed })
  digitalFormats?: Record<string, string>;

  @ApiProperty({ description: 'Awards and recognition' })
  @Prop({ type: [String] })
  awards?: string[];

  @ApiProperty({ description: 'Reviews and ratings' })
  @Prop({
    type: {
      averageRating: { type: Number, min: 0, max: 5 },
      totalReviews: { type: Number, min: 0 },
      reviews: { type: [String] },
    },
  })
  reviews?: {
    averageRating?: number;
    totalReviews?: number;
    reviews?: string[];
  };

  @ApiProperty({ description: 'Additional specifications' })
  @Prop({ type: MongooseSchema.Types.Mixed })
  additionalSpecs?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

export const BookSpecificationSchema = SchemaFactory.createForClass(BookSpecification);

// Indexes
BookSpecificationSchema.index({ productId: 1 }, { unique: true });
BookSpecificationSchema.index({ isbn: 1 }, { unique: true, sparse: true });
BookSpecificationSchema.index({ isbn13: 1 }, { unique: true, sparse: true });
BookSpecificationSchema.index({ isbn10: 1 }, { unique: true, sparse: true });
BookSpecificationSchema.index({ subject: 1 });
BookSpecificationSchema.index({ gradeLevel: 1 });
BookSpecificationSchema.index({ board: 1 });
BookSpecificationSchema.index({ language: 1 });
BookSpecificationSchema.index({ format: 1 });
