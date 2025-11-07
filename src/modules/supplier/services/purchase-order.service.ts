import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { BaseService } from '../../../common/services/base.service';
import { PurchaseOrder } from '../schemas/purchase-order.schema';
import { PurchaseOrderRepository } from '../repositories/purchase-order.repository';
import { PurchaseOrderStatus } from '../schemas/purchase-order.schema';

@Injectable()
export class PurchaseOrderService extends BaseService<PurchaseOrder> {
  constructor(private readonly purchaseOrderRepository: PurchaseOrderRepository) {
    super(purchaseOrderRepository);
  }

  async findByOrderNumber(orderNumber: string): Promise<PurchaseOrder> {
    const order = await this.purchaseOrderRepository.findByOrderNumber(orderNumber);
    if (!order) {
      throw new NotFoundException('Purchase order not found');
    }
    return order;
  }

  async findBySupplierId(supplierId: string): Promise<PurchaseOrder[]> {
    return this.purchaseOrderRepository.findBySupplierId(supplierId);
  }

  async findByStatus(status: PurchaseOrderStatus): Promise<PurchaseOrder[]> {
    return this.purchaseOrderRepository.findByStatus(status);
  }

  async findPendingOrders(): Promise<PurchaseOrder[]> {
    return this.purchaseOrderRepository.findPendingOrders();
  }

  async findOverdueOrders(): Promise<PurchaseOrder[]> {
    return this.purchaseOrderRepository.findOverdueOrders();
  }

  async approveOrder(orderId: string, approvedBy: string): Promise<PurchaseOrder> {
    const order = await this.purchaseOrderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException('Purchase order not found');
    }

    if (order.status !== PurchaseOrderStatus.DRAFT && order.status !== PurchaseOrderStatus.PENDING) {
      throw new BadRequestException('Order cannot be approved in current status');
    }

    return this.purchaseOrderRepository.update(orderId, {
      status: PurchaseOrderStatus.APPROVED,
      approvedBy,
      approvedAt: new Date(),
    });
  }

  async markAsOrdered(orderId: string): Promise<PurchaseOrder> {
    const order = await this.purchaseOrderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException('Purchase order not found');
    }

    if (order.status !== PurchaseOrderStatus.APPROVED) {
      throw new BadRequestException('Order must be approved before marking as ordered');
    }

    return this.purchaseOrderRepository.update(orderId, {
      status: PurchaseOrderStatus.ORDERED,
      orderedAt: new Date(),
    });
  }

  async receiveOrder(orderId: string, receivedItems: Array<{ itemIndex: number; quantity: number }>): Promise<PurchaseOrder> {
    const order = await this.purchaseOrderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException('Purchase order not found');
    }

    if (order.status !== PurchaseOrderStatus.ORDERED && order.status !== PurchaseOrderStatus.PARTIALLY_RECEIVED) {
      throw new BadRequestException('Order must be ordered before receiving items');
    }

    // Update received quantities
    const updatedItems = order.items.map((item, index) => {
      const receivedItem = receivedItems.find(ri => ri.itemIndex === index);
      if (receivedItem) {
        const newQuantityReceived = item.quantityReceived + receivedItem.quantity;
        return {
          ...item,
          quantityReceived: Math.min(newQuantityReceived, item.quantity),
        };
      }
      return item;
    });

    const totalReceived = updatedItems.reduce((sum, item) => sum + item.quantityReceived, 0);
    const totalOrdered = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

    const newStatus = totalReceived >= totalOrdered 
      ? PurchaseOrderStatus.RECEIVED 
      : PurchaseOrderStatus.PARTIALLY_RECEIVED;

    return this.purchaseOrderRepository.update(orderId, {
      items: updatedItems,
      status: newStatus,
      actualDeliveryDate: newStatus === PurchaseOrderStatus.RECEIVED ? new Date() : undefined,
    });
  }

  async cancelOrder(orderId: string, reason?: string): Promise<PurchaseOrder> {
    const order = await this.purchaseOrderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException('Purchase order not found');
    }

    if (order.status === PurchaseOrderStatus.RECEIVED) {
      throw new BadRequestException('Cannot cancel a received order');
    }

    return this.purchaseOrderRepository.update(orderId, {
      status: PurchaseOrderStatus.CANCELLED,
      notes: reason ? `${order.notes || ''}\nCancelled: ${reason}`.trim() : order.notes,
    });
  }

  async getOrderSummary(): Promise<any> {
    return this.purchaseOrderRepository.getOrderSummary();
  }
}