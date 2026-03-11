import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Observable } from 'rxjs';
import { retryAsync } from '../../common/utils/retry.util';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

interface ProductServiceClient {
  findOne(data: { id: string }): Observable<unknown>;
  findAll(data: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Observable<unknown>;
  create(data: CreateProductDto): Observable<unknown>;
  update(data: UpdateProductDto & { id: string }): Observable<unknown>;
  delete(data: { id: string }): Observable<unknown>;
}

@Injectable()
export class ProductsService {
  private productService: ProductServiceClient;

  constructor(@Inject('PRODUCT_PACKAGE') private client: ClientGrpc) {
    this.productService =
      this.client.getService<ProductServiceClient>('ProductService');
  }

  private async callProductService<T>(fn: () => Promise<T>): Promise<T> {
    return retryAsync(fn);
  }

  async create(dto: CreateProductDto) {
    return this.callProductService(() =>
      firstValueFrom(this.productService.create(dto)),
    );
  }

  async findAll(
    page: number,
    limit: number,
    search?: string,
    sortBy?: string,
    sortOrder?: string,
  ) {
    return this.callProductService(() =>
      firstValueFrom(
        this.productService.findAll({ page, limit, search, sortBy, sortOrder }),
      ),
    );
  }

  async findOne(id: string) {
    return this.callProductService(() =>
      firstValueFrom(this.productService.findOne({ id })),
    );
  }

  async update(id: string, dto: UpdateProductDto) {
    return this.callProductService(() =>
      firstValueFrom(this.productService.update({ id, ...dto })),
    );
  }

  async delete(id: string) {
    return this.callProductService(() =>
      firstValueFrom(this.productService.delete({ id })),
    );
  }
}
