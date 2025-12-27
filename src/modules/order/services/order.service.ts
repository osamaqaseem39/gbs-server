import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { OrderDocument, OrderStatus, PaymentStatus } from '../schemas/order.schema';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { BaseService } from '../../../common/services/base.service';

@Injectable()
export class OrderService extends BaseService<OrderDocument> {
  constructor(private readonly orderRepository: OrderRepository) {
    super(orderRepository);
  }

  async create(createOrderDto: CreateOrderDto): Promise<OrderDocument> {
    // Note: createOrderDto.paymentMethod should be paymentMethodId
    // For COD orders, set payment status to UNPAID initially
    // This check would need to be done by looking up the PaymentMethod by ID
    // For now, we'll set it if paymentMethod is provided
    if (createOrderDto.paymentMethod) {
      createOrderDto.paymentStatus = PaymentStatus.UNPAID;
    }

    const orderData: any = { ...createOrderDto };
    if (orderData.paymentMethod) {
      // If paymentMethod is provided as string (code), it should be converted to paymentMethodId
      // For now, we'll assume it's already paymentMethodId
      orderData.paymentMethodId = orderData.paymentMethod;
      delete orderData.paymentMethod;
    }

    return await this.orderRepository.create(orderData);
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<OrderDocument> {
    // Check if order exists
    await this.findById(id);

    const updatedOrder = await this.orderRepository.updateStatus(id, status);
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return updatedOrder;
  }

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<OrderDocument> {
    // Check if order exists
    await this.findById(id);

    const updatedOrder = await this.orderRepository.updatePaymentStatus(id, paymentStatus);
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return updatedOrder;
  }

  async getOrderStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
  }> {
    return await this.orderRepository.getOrderStats();
  }

  async getCODPendingOrders(): Promise<OrderDocument[]> {
    // This would need to query PaymentMethod to find COD method IDs
    // For now, return empty array - this needs proper implementation
    return [];
  }

  async markCODPaymentReceived(orderId: string): Promise<OrderDocument> {
    const order = await this.findById(orderId);
    
    // Need to populate paymentMethodId and check the code
    // For now, we'll skip the COD check and just update payment status
    // This should be properly implemented by populating paymentMethodId
    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Payment has already been marked as received');
    }

    return await this.updatePaymentStatus(orderId, PaymentStatus.PAID);
  }
}