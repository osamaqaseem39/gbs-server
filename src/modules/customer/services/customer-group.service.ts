import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../../../common/services/base.service';
import { CustomerGroup } from '../schemas/customer-group.schema';
import { CustomerGroupRepository } from '../repositories/customer-group.repository';

@Injectable()
export class CustomerGroupService extends BaseService<CustomerGroup> {
  constructor(private readonly customerGroupRepository: CustomerGroupRepository) {
    super(customerGroupRepository);
  }

  async findByCode(code: string): Promise<CustomerGroup> {
    const group = await this.customerGroupRepository.findByCode(code);
    if (!group) {
      throw new NotFoundException('Customer group not found');
    }
    return group;
  }

  async findActiveGroups(): Promise<CustomerGroup[]> {
    return this.customerGroupRepository.findActiveGroups();
  }

  async findByPriority(priority: number): Promise<CustomerGroup[]> {
    return this.customerGroupRepository.findByPriority(priority);
  }

  async searchGroups(searchTerm: string): Promise<CustomerGroup[]> {
    return this.customerGroupRepository.searchGroups(searchTerm);
  }

  async incrementMembersCount(groupId: string): Promise<CustomerGroup> {
    const group = await this.customerGroupRepository.incrementMembersCount(groupId);
    if (!group) {
      throw new NotFoundException('Customer group not found');
    }
    return group;
  }

  async decrementMembersCount(groupId: string): Promise<CustomerGroup> {
    const group = await this.customerGroupRepository.decrementMembersCount(groupId);
    if (!group) {
      throw new NotFoundException('Customer group not found');
    }
    return group;
  }

  async getGroupStats(): Promise<any> {
    return this.customerGroupRepository.getGroupStats();
  }

  async findEligibleGroups(customerData: {
    orderCount: number;
    totalSpent: number;
    registrationDate: Date;
    tags: string[];
  }): Promise<CustomerGroup[]> {
    const allGroups = await this.findActiveGroups();
    
    return allGroups.filter(group => {
      if (!group.criteria) return true;

      const criteria = group.criteria;
      
      // Check minimum order count
      if (criteria.minOrderCount && customerData.orderCount < criteria.minOrderCount) {
        return false;
      }

      // Check minimum total spent
      if (criteria.minTotalSpent && customerData.totalSpent < criteria.minTotalSpent) {
        return false;
      }

      // Check registration date range
      if (criteria.registrationDateFrom) {
        const fromDate = new Date(criteria.registrationDateFrom);
        if (customerData.registrationDate < fromDate) {
          return false;
        }
      }

      if (criteria.registrationDateTo) {
        const toDate = new Date(criteria.registrationDateTo);
        if (customerData.registrationDate > toDate) {
          return false;
        }
      }

      // Check tags
      if (criteria.tags && criteria.tags.length > 0) {
        const hasMatchingTag = criteria.tags.some(tag => 
          customerData.tags.includes(tag)
        );
        if (!hasMatchingTag) {
          return false;
        }
      }

      return true;
    });
  }
}