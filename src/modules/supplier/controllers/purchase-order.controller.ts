import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { CreatePurchaseOrderDto } from '../dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from '../dto/update-purchase-order.dto';

@ApiTags('Purchase Orders')
@Controller('purchase-orders')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Post()
  create(@Body() dto: CreatePurchaseOrderDto) {
    const purchaseOrderData = {
      ...dto,
      expectedDeliveryDate: dto.expectedDeliveryDate ? new Date(dto.expectedDeliveryDate) : undefined,
      items: dto.items.map(item => ({
        ...item,
        quantityReceived: 0,
        totalCost: item.unitCost * item.quantity,
        expectedDeliveryDate: item.expectedDeliveryDate ? new Date(item.expectedDeliveryDate) : undefined
      }))
    };
    return this.purchaseOrderService.create(purchaseOrderData);
  }

  @Get()
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.purchaseOrderService.findAll({ page: Number(page), limit: Number(limit) });
  }

  @Get('summary')
  getSummary() {
    return this.purchaseOrderService.getOrderSummary();
  }

  @Get('pending')
  findPending() {
    return this.purchaseOrderService.findPendingOrders();
  }

  @Get('overdue')
  findOverdue() {
    return this.purchaseOrderService.findOverdueOrders();
  }

  @Get('supplier/:supplierId')
  findBySupplier(@Param('supplierId') supplierId: string) {
    return this.purchaseOrderService.findBySupplierId(supplierId);
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: string) {
    return this.purchaseOrderService.findByStatus(status as any);
  }

  @Get('number/:orderNumber')
  findByOrderNumber(@Param('orderNumber') orderNumber: string) {
    return this.purchaseOrderService.findByOrderNumber(orderNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseOrderService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePurchaseOrderDto) {
    const purchaseOrderData = {
      ...dto,
      expectedDeliveryDate: dto.expectedDeliveryDate ? new Date(dto.expectedDeliveryDate) : undefined,
      items: dto.items?.map(item => ({
        ...item,
        quantityReceived: 0,
        totalCost: item.unitCost * item.quantity,
        expectedDeliveryDate: item.expectedDeliveryDate ? new Date(item.expectedDeliveryDate) : undefined
      }))
    };
    return this.purchaseOrderService.update(id, purchaseOrderData);
  }

  @Put(':id/approve')
  approve(@Param('id') id: string, @Body() body: { approvedBy: string }) {
    return this.purchaseOrderService.approveOrder(id, body.approvedBy);
  }

  @Put(':id/order')
  markAsOrdered(@Param('id') id: string) {
    return this.purchaseOrderService.markAsOrdered(id);
  }

  @Put(':id/receive')
  receiveOrder(@Param('id') id: string, @Body() body: { receivedItems: Array<{ itemIndex: number; quantity: number }> }) {
    return this.purchaseOrderService.receiveOrder(id, body.receivedItems);
  }

  @Put(':id/cancel')
  cancelOrder(@Param('id') id: string, @Body() body: { reason?: string }) {
    return this.purchaseOrderService.cancelOrder(id, body.reason);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseOrderService.delete(id);
  }
}