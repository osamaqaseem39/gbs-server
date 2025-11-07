import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { Uniform, UniformDocument } from '../schemas/uniform.schema';

@Injectable()
export class UniformRepository extends BaseRepository<UniformDocument> {
  constructor(
    @InjectModel(Uniform.name) private readonly uniformModel: Model<UniformDocument>,
  ) {
    super(uniformModel);
  }

  async findBySlug(slug: string): Promise<UniformDocument | null> {
    return this.uniformModel.findOne({ slug }).exec();
  }

  async findBySchoolName(schoolName: string): Promise<UniformDocument[]> {
    return this.uniformModel.find({ schoolName }).exec();
  }

  async findByGradeLevel(gradeLevel: string): Promise<UniformDocument[]> {
    return this.uniformModel.find({ gradeLevel }).exec();
  }

  async findByType(type: string): Promise<UniformDocument[]> {
    return this.uniformModel.find({ type }).exec();
  }

  async findByGender(gender: string): Promise<UniformDocument[]> {
    return this.uniformModel.find({ gender }).exec();
  }

  async findByProductId(productId: string): Promise<UniformDocument | null> {
    return this.uniformModel.findOne({ productId }).exec();
  }

  async findActiveUniforms(): Promise<UniformDocument[]> {
    return this.uniformModel.find({ isActive: true }).exec();
  }

  async findByFilters(filters: {
    schoolName?: string;
    gradeLevel?: string;
    type?: string;
    gender?: string;
    season?: string;
    isActive?: boolean;
  }): Promise<UniformDocument[]> {
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
    if (filters.gender) {
      query.gender = filters.gender;
    }
    if (filters.season) {
      query.season = new RegExp(filters.season, 'i');
    }
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    return this.uniformModel.find(query).exec();
  }
}
