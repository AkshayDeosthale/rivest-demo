import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductService } from './product.service';
import {
  FindOneRequest,
  FindAllRequest,
  CreateProductRequest,
  UpdateProductRequest,
  DeleteProductRequest,
  CheckStockRequest,
  UpdateStockRequest,
} from './product.interfaces';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod('ProductService', 'FindOne')
  findOne(data: FindOneRequest) {
    return this.productService.findOne(data.id);
  }

  @GrpcMethod('ProductService', 'FindAll')
  findAll(data: FindAllRequest) {
    return this.productService.findAll(
      data.page || 1,
      data.limit || 10,
      data.search,
      data.sortBy,
      data.sortOrder,
    );
  }

  @GrpcMethod('ProductService', 'Create')
  create(data: CreateProductRequest) {
    return this.productService.create(data);
  }

  @GrpcMethod('ProductService', 'Update')
  update(data: UpdateProductRequest) {
    return this.productService.update(data);
  }

  @GrpcMethod('ProductService', 'Delete')
  delete(data: DeleteProductRequest) {
    return this.productService.delete(data.id);
  }

  @GrpcMethod('ProductService', 'CheckStock')
  checkStock(data: CheckStockRequest) {
    return this.productService.checkStock(data.productId, data.quantity);
  }

  @GrpcMethod('ProductService', 'UpdateStock')
  updateStock(data: UpdateStockRequest) {
    return this.productService.updateStock(data.productId, data.delta);
  }
}
