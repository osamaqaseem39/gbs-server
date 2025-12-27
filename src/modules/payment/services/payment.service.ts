import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument, PaymentStatus } from '../schemas/payment.schema';
import { PaymentMethod, PaymentMethodDocument } from '../schemas/payment-method.schema';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { PaginationOptions, PaginatedResult } from '../../../common/interfaces/base.interface';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<PaymentDocument>,
    @InjectModel(PaymentMethod.name) private readonly paymentMethodModel: Model<PaymentMethodDocument>,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto): Promise<PaymentDocument> {
    // Check if payment already exists for this order
    const existingPayment = await this.paymentModel.findOne({ 
      orderId: createPaymentDto.orderId 
    });
    
    if (existingPayment) {
      throw new ConflictException(`Payment already exists for order ${createPaymentDto.orderId}`);
    }

    // Validate payment amount
    if (createPaymentDto.amount <= 0) {
      throw new BadRequestException('Payment amount must be greater than 0');
    }

    // Convert method (code) to paymentMethodId if needed
    let paymentMethodId = (createPaymentDto as any).paymentMethodId;
    if (!paymentMethodId && createPaymentDto.method) {
      // Find PaymentMethod by code
      const paymentMethod = await this.paymentMethodModel.findOne({ 
        code: createPaymentDto.method.toLowerCase() 
      });
      if (!paymentMethod) {
        throw new BadRequestException(`Payment method '${createPaymentDto.method}' not found`);
      }
      paymentMethodId = paymentMethod._id;
    }

    // For COD orders, set status to PENDING by default
    if (createPaymentDto.method && (
        createPaymentDto.method.toLowerCase() === 'cash_on_delivery' || 
        createPaymentDto.method.toLowerCase() === 'cod')) {
      createPaymentDto.status = PaymentStatus.PENDING;
    }

    const paymentData: any = {
      orderId: createPaymentDto.orderId,
      paymentMethodId,
      amount: createPaymentDto.amount,
      currency: createPaymentDto.currency || 'PKR',
      status: createPaymentDto.status || PaymentStatus.PENDING,
      transactionId: createPaymentDto.transactionId,
      gatewayResponse: createPaymentDto.processorResponse,
    };

    const payment = new this.paymentModel(paymentData);
    return await payment.save();
  }

  async findAll(options?: PaginationOptions): Promise<PaginatedResult<PaymentDocument>> {
    const { page = 1, limit = 10, sort, order = 'desc' } = options || {};
    const skip = (page - 1) * limit;
    
    const query = this.paymentModel.find();
    
    if (sort) {
      query.sort({ [sort]: order === 'desc' ? -1 : 1 });
    } else {
      query.sort({ createdAt: -1 });
    }
    
    const [data, total] = await Promise.all([
      query.skip(skip).limit(limit).exec(),
      this.paymentModel.countDocuments().exec(),
    ]);
    
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<PaymentDocument> {
    const payment = await this.paymentModel.findById(id).exec();
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async findByOrderId(orderId: string): Promise<PaymentDocument | null> {
    return await this.paymentModel.findOne({ orderId }).exec();
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<PaymentDocument> {
    const payment = await this.findOne(id);
    
    Object.assign(payment, updatePaymentDto);
    return await payment.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.paymentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
  }

  // COD-specific methods
  async markCODPaymentReceived(orderId: string, amount: number, notes?: string): Promise<PaymentDocument> {
    const payment = await this.paymentModel.findOne({ orderId })
      .populate('paymentMethodId')
      .exec();
    
    if (!payment) {
      throw new NotFoundException(`Payment not found for order ${orderId}`);
    }

    const paymentMethod = payment.paymentMethodId as any;
    if (!paymentMethod) {
      throw new BadRequestException('Payment method not found');
    }

    const methodCode = paymentMethod.code?.toLowerCase();
    if (methodCode !== 'cash_on_delivery' && methodCode !== 'cod') {
      throw new BadRequestException('This payment is not a COD payment');
    }

    if (payment.status === PaymentStatus.COMPLETED) {
      throw new BadRequestException('Payment has already been marked as received');
    }

    // Update payment status to completed
    payment.status = PaymentStatus.COMPLETED;
    payment.paidAt = new Date();
    // Notes can be stored in gatewayResponse if needed
    if (notes) {
      payment.gatewayResponse = { ...payment.gatewayResponse, codNotes: notes };
    }

    return await payment.save();
  }

  async getCODPendingPayments(): Promise<PaymentDocument[]> {
    // Find COD payment methods
    const codMethods = await this.paymentMethodModel.find({
      code: { $in: ['cash_on_delivery', 'cod'] }
    }).exec();
    
    const codMethodIds = codMethods.map(m => m._id);
    
    return await this.paymentModel.find({
      paymentMethodId: { $in: codMethodIds },
      status: PaymentStatus.PENDING
    }).populate('orderId').populate('paymentMethodId').exec();
  }

  async getPaymentStats(): Promise<{
    totalPayments: number;
    totalAmount: number;
    pendingPayments: number;
    completedPayments: number;
    codPayments: number;
  }> {
    // Find COD payment methods
    const codMethods = await this.paymentMethodModel.find({
      code: { $in: ['cash_on_delivery', 'cod'] }
    }).exec();
    
    const codMethodIds = codMethods.map(m => m._id);

    const [
      totalPayments,
      totalAmount,
      pendingPayments,
      completedPayments,
      codPayments
    ] = await Promise.all([
      this.paymentModel.countDocuments(),
      this.paymentModel.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).then(result => result[0]?.total || 0),
      this.paymentModel.countDocuments({ status: PaymentStatus.PENDING }),
      this.paymentModel.countDocuments({ status: PaymentStatus.COMPLETED }),
      this.paymentModel.countDocuments({ 
        paymentMethodId: { $in: codMethodIds } 
      })
    ]);

    return {
      totalPayments,
      totalAmount,
      pendingPayments,
      completedPayments,
      codPayments
    };
  }
}