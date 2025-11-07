import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomerGroupService } from '../services/customer-group.service';
import { CreateCustomerGroupDto } from '../dto/create-customer-group.dto';
import { UpdateCustomerGroupDto } from '../dto/update-customer-group.dto';

@ApiTags('Customer Groups')
@Controller('customer-groups')
export class CustomerGroupController {
  constructor(private readonly customerGroupService: CustomerGroupService) {}

  @Post()
  create(@Body() dto: CreateCustomerGroupDto) {
    const customerGroupData = {
      ...dto,
      criteria: {
        ...dto.criteria,
        registrationDateFrom: dto.criteria?.registrationDateFrom ? new Date(dto.criteria.registrationDateFrom) : undefined,
        registrationDateTo: dto.criteria?.registrationDateTo ? new Date(dto.criteria.registrationDateTo) : undefined
      }
    };
    return this.customerGroupService.create(customerGroupData);
  }

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.customerGroupService.findAll({ page: Number(page), limit: Number(limit) });
  }

  @Get('stats')
  getStats() {
    return this.customerGroupService.getGroupStats();
  }

  @Get('active')
  findActive() {
    return this.customerGroupService.findActiveGroups();
  }

  @Get('search')
  search(@Query('q') searchTerm: string) {
    return this.customerGroupService.searchGroups(searchTerm);
  }

  @Get('priority/:priority')
  findByPriority(@Param('priority') priority: number) {
    return this.customerGroupService.findByPriority(priority);
  }

  @Get('eligible')
  findEligible(@Body() customerData: {
    orderCount: number;
    totalSpent: number;
    registrationDate: string;
    tags: string[];
  }) {
    return this.customerGroupService.findEligibleGroups({
      ...customerData,
      registrationDate: new Date(customerData.registrationDate),
    });
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.customerGroupService.findByCode(code);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerGroupService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCustomerGroupDto) {
    const customerGroupData = {
      ...dto,
      criteria: {
        ...dto.criteria,
        registrationDateFrom: dto.criteria?.registrationDateFrom ? new Date(dto.criteria.registrationDateFrom) : undefined,
        registrationDateTo: dto.criteria?.registrationDateTo ? new Date(dto.criteria.registrationDateTo) : undefined
      }
    };
    return this.customerGroupService.update(id, customerGroupData);
  }

  @Put(':id/increment-members')
  incrementMembers(@Param('id') id: string) {
    return this.customerGroupService.incrementMembersCount(id);
  }

  @Put(':id/decrement-members')
  decrementMembers(@Param('id') id: string) {
    return this.customerGroupService.decrementMembersCount(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerGroupService.delete(id);
  }
}