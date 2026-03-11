import { Injectable, Inject } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Observable } from 'rxjs';
import { PrismaService } from '../../../libs/prisma/src/prisma.service';
import type { Decimal } from '@prisma/client/runtime/library';

interface ProductServiceClient {
  checkStock(data: {
    productId: string;
    quantity: number;
  }): Observable<{ available: boolean; price: number; stock: number }>;
  updateStock(data: { productId: string; delta: number }): Observable<unknown>;
}

@Injectable()
export class OrderService {
  private productService: ProductServiceClient;

  constructor(
    private readonly prisma: PrismaService,
    @Inject('PRODUCT_PACKAGE') private productClient: ClientGrpc,
  ) {
    this.productService =
      this.productClient.getService<ProductServiceClient>('ProductService');
  }

  private toGrpcOrder(order: {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
    totalPrice: Decimal;
    orderStatus: string;
    address: string | null;
    phone: string | null;
    createdAt: Date;
  }) {
    return {
      id: order.id,
      userId: order.userId,
      productId: order.productId,
      quantity: order.quantity,
      totalPrice: Number(order.totalPrice),
      orderStatus: order.orderStatus,
      address: order.address || '',
      phone: order.phone || '',
      createdAt: order.createdAt.toISOString(),
    };
  }

  async createOrder(
    productId: string,
    quantity: number,
    userId: string,
    address?: string,
    phone?: string,
  ) {
    if (!productId || quantity <= 0) {
      throw new RpcException({
        code: 3,
        message: 'Invalid productId or quantity',
      });
    }

    let stockCheck: { available: boolean; price: number; stock: number };
    try {
      stockCheck = await firstValueFrom(
        this.productService.checkStock({ productId, quantity }),
      );
    } catch (err) {
      const e = err as { code?: number; message?: string };
      throw new RpcException({
        code: e.code ?? 2,
        message: e.message ?? 'Product service unavailable',
      });
    }

    if (!stockCheck.available || stockCheck.stock < quantity) {
      throw new RpcException({
        code: 3,
        message: 'Insufficient stock',
      });
    }

    const totalPrice = stockCheck.price * quantity;

    const order = await this.prisma.order.create({
      data: {
        userId,
        productId,
        quantity,
        totalPrice,
        orderStatus: 'PENDING',
        address: address || null,
        phone: phone || null,
      },
    });

    try {
      await firstValueFrom(
        this.productService.updateStock({
          productId,
          delta: -quantity,
        }),
      );
    } catch {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { orderStatus: 'CANCELLED' },
      });
      throw new RpcException({
        code: 2,
        message: 'Failed to update inventory',
      });
    }

    return this.toGrpcOrder(order);
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    if (!order) {
      throw new RpcException({
        code: 5,
        message: 'Order not found',
      });
    }
    return this.toGrpcOrder(order);
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count(),
    ]);
    return {
      orders: orders.map((o) => this.toGrpcOrder(o)),
      total,
    };
  }

  async findAllByUser(userId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const where = { userId };
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);
    return {
      orders: orders.map((o) => this.toGrpcOrder(o)),
      total,
    };
  }
}
