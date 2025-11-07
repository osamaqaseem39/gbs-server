import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { BaseService } from '../../../common/services/base.service';
import { SchoolSetRepository } from '../repositories/school-set.repository';
import { SchoolSetDocument } from '../schemas/school-set.schema';
import { CreateSchoolSetDto } from '../dto/create-school-set.dto';
import { UpdateSchoolSetDto } from '../dto/update-school-set.dto';

@Injectable()
export class SchoolSetService extends BaseService<SchoolSetDocument> {
  constructor(
    private readonly schoolSetRepository: SchoolSetRepository,
  ) {
    super(schoolSetRepository);
  }

  async createSchoolSet(createSchoolSetDto: CreateSchoolSetDto): Promise<SchoolSetDocument> {
    // Check if school set with same slug already exists
    const existingSlug = await this.schoolSetRepository.findBySlug(createSchoolSetDto.slug);
    if (existingSlug) {
      throw new ConflictException(`School set with slug '${createSchoolSetDto.slug}' already exists`);
    }

    // Validate items array
    if (!createSchoolSetDto.items || createSchoolSetDto.items.length === 0) {
      throw new BadRequestException('School set must have at least one item');
    }

    // Validate price
    if (createSchoolSetDto.price < 0) {
      throw new BadRequestException('Price cannot be negative');
    }

    // Validate discount percentage
    if (createSchoolSetDto.discountPercentage && (createSchoolSetDto.discountPercentage < 0 || createSchoolSetDto.discountPercentage > 100)) {
      throw new BadRequestException('Discount percentage must be between 0 and 100');
    }

    // Validate original price if provided
    if (createSchoolSetDto.originalPrice && createSchoolSetDto.originalPrice <= createSchoolSetDto.price) {
      throw new BadRequestException('Original price must be greater than current price');
    }

    // Validate stock quantity
    if (createSchoolSetDto.stockQuantity !== undefined && createSchoolSetDto.stockQuantity < 0) {
      throw new BadRequestException('Stock quantity cannot be negative');
    }

    // Validate order quantities
    if (createSchoolSetDto.minOrderQuantity && createSchoolSetDto.minOrderQuantity < 1) {
      throw new BadRequestException('Minimum order quantity must be at least 1');
    }

    if (createSchoolSetDto.maxOrderQuantity && createSchoolSetDto.maxOrderQuantity < 1) {
      throw new BadRequestException('Maximum order quantity must be at least 1');
    }

    if (createSchoolSetDto.minOrderQuantity && createSchoolSetDto.maxOrderQuantity && 
        createSchoolSetDto.minOrderQuantity > createSchoolSetDto.maxOrderQuantity) {
      throw new BadRequestException('Minimum order quantity cannot be greater than maximum order quantity');
    }

    const schoolSetData = {
      ...createSchoolSetDto,
      items: createSchoolSetDto.items.map(item => ({
        ...item,
        isRequired: item.isRequired !== undefined ? item.isRequired : true
      }))
    };
    return await this.schoolSetRepository.create(schoolSetData);
  }

  async updateSchoolSet(id: string, updateSchoolSetDto: UpdateSchoolSetDto): Promise<SchoolSetDocument> {
    const existingSchoolSet = await this.schoolSetRepository.findById(id);
    if (!existingSchoolSet) {
      throw new NotFoundException(`School set with ID '${id}' not found`);
    }

    // Check if slug is being updated and if it already exists
    if (updateSchoolSetDto.slug && updateSchoolSetDto.slug !== existingSchoolSet.slug) {
      const existingSlug = await this.schoolSetRepository.findBySlug(updateSchoolSetDto.slug);
      if (existingSlug) {
        throw new ConflictException(`School set with slug '${updateSchoolSetDto.slug}' already exists`);
      }
    }

    // Validate items array if provided
    if (updateSchoolSetDto.items && updateSchoolSetDto.items.length === 0) {
      throw new BadRequestException('School set must have at least one item');
    }

    // Validate price if provided
    if (updateSchoolSetDto.price !== undefined && updateSchoolSetDto.price < 0) {
      throw new BadRequestException('Price cannot be negative');
    }

    // Validate discount percentage if provided
    if (updateSchoolSetDto.discountPercentage !== undefined && 
        (updateSchoolSetDto.discountPercentage < 0 || updateSchoolSetDto.discountPercentage > 100)) {
      throw new BadRequestException('Discount percentage must be between 0 and 100');
    }

    // Validate original price if provided
    if (updateSchoolSetDto.originalPrice !== undefined && updateSchoolSetDto.price !== undefined &&
        updateSchoolSetDto.originalPrice <= updateSchoolSetDto.price) {
      throw new BadRequestException('Original price must be greater than current price');
    }

    // Validate stock quantity if provided
    if (updateSchoolSetDto.stockQuantity !== undefined && updateSchoolSetDto.stockQuantity < 0) {
      throw new BadRequestException('Stock quantity cannot be negative');
    }

    // Validate order quantities if provided
    if (updateSchoolSetDto.minOrderQuantity !== undefined && updateSchoolSetDto.minOrderQuantity < 1) {
      throw new BadRequestException('Minimum order quantity must be at least 1');
    }

    if (updateSchoolSetDto.maxOrderQuantity !== undefined && updateSchoolSetDto.maxOrderQuantity < 1) {
      throw new BadRequestException('Maximum order quantity must be at least 1');
    }

    if (updateSchoolSetDto.minOrderQuantity !== undefined && updateSchoolSetDto.maxOrderQuantity !== undefined && 
        updateSchoolSetDto.minOrderQuantity > updateSchoolSetDto.maxOrderQuantity) {
      throw new BadRequestException('Minimum order quantity cannot be greater than maximum order quantity');
    }

    const schoolSetData = {
      ...updateSchoolSetDto,
      items: updateSchoolSetDto.items?.map(item => ({
        ...item,
        isRequired: item.isRequired !== undefined ? item.isRequired : true
      }))
    };
    return await this.schoolSetRepository.update(id, schoolSetData);
  }

  async findBySlug(slug: string): Promise<SchoolSetDocument> {
    const schoolSet = await this.schoolSetRepository.findBySlug(slug);
    if (!schoolSet) {
      throw new NotFoundException(`School set with slug '${slug}' not found`);
    }
    return schoolSet;
  }

  async findBySchoolName(schoolName: string): Promise<SchoolSetDocument[]> {
    return await this.schoolSetRepository.findBySchoolName(schoolName);
  }

  async findByGradeLevel(gradeLevel: string): Promise<SchoolSetDocument[]> {
    return await this.schoolSetRepository.findByGradeLevel(gradeLevel);
  }

  async findByType(type: string): Promise<SchoolSetDocument[]> {
    return await this.schoolSetRepository.findByType(type);
  }

  async findByBoard(board: string): Promise<SchoolSetDocument[]> {
    return await this.schoolSetRepository.findByBoard(board);
  }

  async findByAcademicYear(academicYear: string): Promise<SchoolSetDocument[]> {
    return await this.schoolSetRepository.findByAcademicYear(academicYear);
  }

  async findFeaturedSets(): Promise<SchoolSetDocument[]> {
    return await this.schoolSetRepository.findFeaturedSets();
  }

  async findBestsellerSets(): Promise<SchoolSetDocument[]> {
    return await this.schoolSetRepository.findBestsellerSets();
  }

  async findNewArrivalSets(): Promise<SchoolSetDocument[]> {
    return await this.schoolSetRepository.findNewArrivalSets();
  }

  async findActiveSets(): Promise<SchoolSetDocument[]> {
    return await this.schoolSetRepository.findActiveSets();
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
    return await this.schoolSetRepository.findByFilters(filters);
  }

  async findByProductId(productId: string): Promise<SchoolSetDocument[]> {
    return await this.schoolSetRepository.findByProductId(productId);
  }

  async searchByText(searchText: string): Promise<SchoolSetDocument[]> {
    return await this.schoolSetRepository.searchByText(searchText);
  }

  async toggleActiveStatus(id: string): Promise<SchoolSetDocument> {
    const schoolSet = await this.schoolSetRepository.findById(id);
    if (!schoolSet) {
      throw new NotFoundException(`School set with ID '${id}' not found`);
    }

    return await this.schoolSetRepository.update(id, { isActive: !schoolSet.isActive });
  }

  async toggleFeaturedStatus(id: string): Promise<SchoolSetDocument> {
    const schoolSet = await this.schoolSetRepository.findById(id);
    if (!schoolSet) {
      throw new NotFoundException(`School set with ID '${id}' not found`);
    }

    return await this.schoolSetRepository.update(id, { isFeatured: !schoolSet.isFeatured });
  }

  async toggleBestsellerStatus(id: string): Promise<SchoolSetDocument> {
    const schoolSet = await this.schoolSetRepository.findById(id);
    if (!schoolSet) {
      throw new NotFoundException(`School set with ID '${id}' not found`);
    }

    return await this.schoolSetRepository.update(id, { isBestseller: !schoolSet.isBestseller });
  }

  async toggleNewArrivalStatus(id: string): Promise<SchoolSetDocument> {
    const schoolSet = await this.schoolSetRepository.findById(id);
    if (!schoolSet) {
      throw new NotFoundException(`School set with ID '${id}' not found`);
    }

    return await this.schoolSetRepository.update(id, { isNewArrival: !schoolSet.isNewArrival });
  }
}
