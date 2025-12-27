import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ProductReviewSummaryDocument = ProductReviewSummary & Document;

@Schema({ timestamps: true })
export class ProductReviewSummary {
  @ApiProperty({ description: 'Review summary ID' })
  _id: string;

  @ApiProperty({ description: 'Product ID' })
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Product', unique: true })
  productId: string;

  @ApiProperty({ description: 'Average rating (0-5)' })
  @Prop({ default: 0, min: 0, max: 5 })
  averageRating: number;

  @ApiProperty({ description: 'Total number of reviews' })
  @Prop({ default: 0, min: 0 })
  totalReviews: number;

  @ApiProperty({ description: 'Rating distribution' })
  @Prop({
    type: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 },
    },
    default: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  })
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };

  @ApiProperty({ description: 'Last updated timestamp' })
  @Prop()
  lastUpdated: Date;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export const ProductReviewSummarySchema = SchemaFactory.createForClass(ProductReviewSummary);

// Indexes
ProductReviewSummarySchema.index({ productId: 1 });
ProductReviewSummarySchema.index({ averageRating: -1 });
ProductReviewSummarySchema.index({ totalReviews: -1 });
ProductReviewSummarySchema.index({ lastUpdated: -1 });

