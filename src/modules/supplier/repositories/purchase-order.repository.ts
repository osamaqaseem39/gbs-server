import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { PurchaseOrder, PurchaseOrderDocument } from '../schemas/purchase-order.schema';
import { PurchaseOrderStatus } from '../schemas/purchase-order.schema';

@Injectable()
export class PurchaseOrderRepository extends BaseRepository<PurchaseOrderDocument> {
  constructor(
    @InjectModel(PurchaseOrder.name) private readonly purchaseOrderModel: Model<PurchaseOrderDocument>,
  ) {
    super(purchaseOrderModel);
  }

  async findByOrderNumber(orderNumber: string): Promise<PurchaseOrderDocument | null> {
    return this.purchaseOrderModel.findOne({ orderNumber }).exec();
  }

  async findBySupplierId(supplierId: string): Promise<PurchaseOrderDocument[]> {
    return this.purchaseOrderModel.find({ supplierId }).sort({ createdAt: -1 }).exec();
  }

  async findByStatus(status: PurchaseOrderStatus): Promise<PurchaseOrderDocument[]> {
    return this.purchaseOrderModel.find({ status }).sort({ createdAt: -1 }).exec();
  }

  async findByCreatedBy(createdBy: string): Promise<PurchaseOrderDocument[]> {
    return this.purchaseOrderModel.find({ createdBy }).sort({ createdAt: -1 }).exec();
  }

  async findPendingOrders(): Promise<PurchaseOrderDocument[]> {
    return this.purchaseOrderModel.find({ 
      status: { $in: [PurchaseOrderStatus.DRAFT, PurchaseOrderStatus.PENDING] }
    }).sort({ createdAt: -1 }).exec();
  }

  async findOverdueOrders(): Promise<PurchaseOrderDocument[]> {
    const today = new Date();
    return this.purchaseOrderModel.find({
      expectedDeliveryDate: { $lt: today },
      status: { $in: [PurchaseOrderStatus.ORDERED, PurchaseOrderStatus.PARTIALLY_RECEIVED] }
    }).sort({ expectedDeliveryDate: 1 }).exec();
  }

  async getOrderSummary(): Promise<any> {
    const totalOrders = await this.purchaseOrderModel.countDocuments();
    const pendingOrders = await this.purchaseOrderModel.countDocuments({ 
      status: { $in: [PurchaseOrderStatus.DRAFT, PurchaseOrderStatus.PENDING] }
    });
    const completedOrders = await this.purchaseOrderModel.countDocuments({ 
      status: PurchaseOrderStatus.RECEIVED 
    });
    
    const totalValue = await this.purchaseOrderModel.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalValue: totalValue.length > 0 ? totalValue[0].total : 0,
    };
  }
}