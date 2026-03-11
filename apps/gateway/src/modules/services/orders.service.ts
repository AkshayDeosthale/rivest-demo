import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Observable } from 'rxjs';
import { retryAsync } from '../../common/utils/retry.util';
import { CreateOrderDto } from './dto/create-order.dto';

interface OrderServiceClient {
  createOrder(data: {
    productId: string;
    quantity: number;
    userId: string;
    address?: string;
    phone?: string;
  }): Observable<unknown>;
  findOne(data: { id: string }): Observable<unknown>;
  findAll(data: { page: number; limit: number }): Observable<unknown>;
  findAllByUser(data: {
    userId: string;
    page: number;
    limit: number;
  }): Observable<unknown>;
}

@Injectable()
export class OrdersService {
  private orderService: OrderServiceClient;

  constructor(@Inject('ORDER_PACKAGE') private client: ClientGrpc) {
    this.orderService =
      this.client.getService<OrderServiceClient>('OrderService');
  }

  private async callOrderService<T>(fn: () => Promise<T>): Promise<T> {
    return retryAsync(fn);
  }

  async create(dto: CreateOrderDto, userId: string) {
    return this.callOrderService(() =>
      firstValueFrom(
        this.orderService.createOrder({
          productId: dto.productId,
          quantity: dto.quantity,
          userId,
          address: dto.address,
          phone: dto.phone,
        }),
      ),
    );
  }

  async findOne(id: string) {
    return this.callOrderService(() =>
      firstValueFrom(this.orderService.findOne({ id })),
    );
  }

  async findAll(page: number, limit: number) {
    return this.callOrderService(() =>
      firstValueFrom(this.orderService.findAll({ page, limit })),
    );
  }

  async findAllByUser(userId: string, page: number, limit: number) {
    return this.callOrderService(() =>
      firstValueFrom(
        this.orderService.findAllByUser({ userId, page, limit }),
      ),
    );
  }
}
