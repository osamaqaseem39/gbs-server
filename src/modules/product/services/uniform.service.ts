import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { BaseService } from '../../../common/services/base.service';
import { UniformRepository } from '../repositories/uniform.repository';
import { UniformDocument } from '../schemas/uniform.schema';
import { CreateUniformDto } from '../dto/create-uniform.dto';
import { UpdateUniformDto } from '../dto/update-uniform.dto';

@Injectable()
export class UniformService extends BaseService<UniformDocument> {
  constructor(
    private readonly uniformRepository: UniformRepository,
  ) {
    super(uniformRepository);
  }

  async createUniform(createUniformDto: CreateUniformDto): Promise<UniformDocument> {
    // Check if uniform with same slug already exists
    const existingSlug = await this.uniformRepository.findBySlug(createUniformDto.slug);
    if (existingSlug) {
      throw new ConflictException(`Uniform with slug '${createUniformDto.slug}' already exists`);
    }

    // Check if uniform with same product ID already exists
    const existingProduct = await this.uniformRepository.findByProductId(createUniformDto.productId);
    if (existingProduct) {
      throw new ConflictException(`Uniform for product ID '${createUniformDto.productId}' already exists`);
    }

    return await this.uniformRepository.create(createUniformDto);
  }

  async updateUniform(id: string, updateUniformDto: UpdateUniformDto): Promise<UniformDocument> {
    const existingUniform = await this.uniformRepository.findById(id);
    if (!existingUniform) {
      throw new NotFoundException(`Uniform with ID '${id}' not found`);
    }

    // Check if slug is being updated and if it already exists
    if (updateUniformDto.slug && updateUniformDto.slug !== existingUniform.slug) {
      const existingSlug = await this.uniformRepository.findBySlug(updateUniformDto.slug);
      if (existingSlug) {
        throw new ConflictException(`Uniform with slug '${updateUniformDto.slug}' already exists`);
      }
    }

    // Check if product ID is being updated and if it already exists
    if (updateUniformDto.productId && updateUniformDto.productId !== existingUniform.productId) {
      const existingProduct = await this.uniformRepository.findByProductId(updateUniformDto.productId);
      if (existingProduct) {
        throw new ConflictException(`Uniform for product ID '${updateUniformDto.productId}' already exists`);
      }
    }

    return await this.uniformRepository.update(id, updateUniformDto);
  }

  async findBySlug(slug: string): Promise<UniformDocument> {
    const uniform = await this.uniformRepository.findBySlug(slug);
    if (!uniform) {
      throw new NotFoundException(`Uniform with slug '${slug}' not found`);
    }
    return uniform;
  }

  async findBySchoolName(schoolName: string): Promise<UniformDocument[]> {
    return await this.uniformRepository.findBySchoolName(schoolName);
  }

  async findByGradeLevel(gradeLevel: string): Promise<UniformDocument[]> {
    return await this.uniformRepository.findByGradeLevel(gradeLevel);
  }

  async findByType(type: string): Promise<UniformDocument[]> {
    return await this.uniformRepository.findByType(type);
  }

  async findByGender(gender: string): Promise<UniformDocument[]> {
    return await this.uniformRepository.findByGender(gender);
  }

  async findByProductId(productId: string): Promise<UniformDocument> {
    const uniform = await this.uniformRepository.findByProductId(productId);
    if (!uniform) {
      throw new NotFoundException(`Uniform for product ID '${productId}' not found`);
    }
    return uniform;
  }

  async findActiveUniforms(): Promise<UniformDocument[]> {
    return await this.uniformRepository.findActiveUniforms();
  }

  async findByFilters(filters: {
    schoolName?: string;
    gradeLevel?: string;
    type?: string;
    gender?: string;
    season?: string;
    isActive?: boolean;
  }): Promise<UniformDocument[]> {
    return await this.uniformRepository.findByFilters(filters);
  }

  async toggleActiveStatus(id: string): Promise<UniformDocument> {
    const uniform = await this.uniformRepository.findById(id);
    if (!uniform) {
      throw new NotFoundException(`Uniform with ID '${id}' not found`);
    }

    return await this.uniformRepository.update(id, { isActive: !uniform.isActive });
  }
}
