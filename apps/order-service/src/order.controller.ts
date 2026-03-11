import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OrderService } from './order.service';
import {
  CreateOrderRequest,
  FindOneOrderRequest,
  FindAllOrdersRequest,
  FindAllByUserRequest,
} from './order.interfaces';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @GrpcMethod('OrderService', 'CreateOrder')
  createOrder(data: CreateOrderRequest) {
    return this.orderService.createOrder(
      data.productId,
      data.quantity,
      data.userId,
      data.address,
      data.phone,
    );
  }

  @GrpcMethod('OrderService', 'FindOne')
  findOne(data: FindOneOrderRequest) {
    return this.orderService.findOne(data.id);
  }

  @GrpcMethod('OrderService', 'FindAll')
  findAll(data: FindAllOrdersRequest) {
    return this.orderService.findAll(data.page || 1, data.limit || 10);
  }

  @GrpcMethod('OrderService', 'FindAllByUser')
  findAllByUser(data: FindAllByUserRequest) {
    return this.orderService.findAllByUser(
      data.userId,
      data.page || 1,
      data.limit || 50,
    );
  }
}
