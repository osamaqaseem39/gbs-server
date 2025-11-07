import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { SchoolSet, SchoolSetDocument } from '../schemas/school-set.schema';

@Injectable()
export class SchoolSetRepository extends BaseRepository<SchoolSetDocument> {
  constructor(
    @InjectModel(SchoolSet.name) private readonly schoolSetModel: Model<SchoolSetDocument>,
  ) {
    super(schoolSetModel);
  }

  async findBySlug(slug: string): Promise<SchoolSetDocument | null> {
    return this.schoolSetModel.findOne({ slug }).exec();
  }

  async findBySchoolName(schoolName: string): Promise<SchoolSetDocument[]> {
    return this.schoolSetModel.find({ schoolName }).exec();
  }

  async findByGradeLevel(gradeLevel: string): Promise<SchoolSetDocument[]> {
    return this.schoolSetModel.find({ gradeLevel }).exec();
  }

  async findByType(type: string): Promise<SchoolSetDocument[]> {
    return this.schoolSetModel.find({ type }).exec();
  }

  async findByBoard(board: string): Promise<SchoolSetDocument[]> {
    return this.schoolSetModel.find({ board }).exec();
  }

  async findByAcademicYear(academicYear: string): Promise<SchoolSetDocument[]> {
    return this.schoolSetModel.find({ academicYear }).exec();
  }

  async findFeaturedSets(): Promise<SchoolSetDocument[]> {
    return this.schoolSetModel.find({ isFeatured: true, isActive: true }).exec();
  }

  async findBestsellerSets(): Promise<SchoolSetDocument[]> {
    return this.schoolSetModel.find({ isBestseller: true, isActive: true }).exec();
  }

  async findNewArrivalSets(): Promise<SchoolSetDocument[]> {
    return this.schoolSetModel.find({ isNewArrival: true, isActive: true }).exec();
  }

  async findActiveSets(): Promise<SchoolSetDocument[]> {
    return this.schoolSetModel.find({ isActive: true }).exec();
  }

  async findByFilters(filters: {
    schoolName?: string;
    gradeLevel?: string;
    type?: string;
    board?: string;
    academicYear?: string;
    subject?: string;
    season?: string;
    gender?: string;
    status?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    isBestseller?: boolean;
    isNewArrival?: boolean;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<SchoolSetDocument[]> {
    const query: any = {};
    
    if (filters.schoolName) {
      query.schoolName = new RegExp(filters.schoolName, 'i');
    }
    if (filters.gradeLevel) {
      query.gradeLevel = filters.gradeLevel;
    }
    if (filters.type) {
      query.type = filters.type;
    }
    if (filters.board) {
      query.board = new RegExp(filters.board, 'i');
    }
    if (filters.academicYear) {
      query.academicYear = filters.academicYear;
    }
    if (filters.subject) {
      query.subject = new RegExp(filters.subject, 'i');
    }
    if (filters.season) {
      query.season = new RegExp(filters.season, 'i');
    }
    if (filters.gender) {
      query.gender = new RegExp(filters.gender, 'i');
    }
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    if (filters.isFeatured !== undefined) {
      query.isFeatured = filters.isFeatured;
    }
    if (filters.isBestseller !== undefined) {
      query.isBestseller = filters.isBestseller;
    }
    if (filters.isNewArrival !== undefined) {
      query.isNewArrival = filters.isNewArrival;
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) {
        query.price.$gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        query.price.$lte = filters.maxPrice;
      }
    }

    return this.schoolSetModel.find(query).exec();
  }

  async findByProductId(productId: string): Promise<SchoolSetDocument[]> {
    return this.schoolSetModel.find({ 'items.productId': productId }).exec();
  }

  async searchByText(searchText: string): Promise<SchoolSetDocument[]> {
    return this.schoolSetModel.find({
      $or: [
        { name: new RegExp(searchText, 'i') },
        { description: new RegExp(searchText, 'i') },
        { schoolName: new RegExp(searchText, 'i') },
        { gradeLevel: new RegExp(searchText, 'i') },
        { board: new RegExp(searchText, 'i') },
        { subject: new RegExp(searchText, 'i') },
        { tags: { $in: [new RegExp(searchText, 'i')] } },
      ]
    }).exec();
  }
}
