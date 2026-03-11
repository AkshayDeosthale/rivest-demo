import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '../../../libs/prisma/src/prisma.service';
import type { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  private toGrpcProduct(product: {
    id: string;
    name: string;
    description: string | null;
    price: Decimal;
    stock: number;
    category: string | null;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: Number(product.price),
      stock: product.stock,
      category: product.category || '',
      image: product.image || '',
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new RpcException({
        code: 5,
        message: 'Product not found',
      });
    }
    return this.toGrpcProduct(product);
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    sortBy?: string,
    sortOrder?: string,
  ) {
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            {
              description: { contains: search, mode: 'insensitive' as const },
            },
            { category: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    type SortDir = 'asc' | 'desc';
    const orderBy =
      sortBy === 'price'
        ? { price: (sortOrder === 'desc' ? 'desc' : 'asc') as SortDir }
        : { createdAt: 'desc' as SortDir };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({ skip, take: limit, where, orderBy }),
      this.prisma.product.count({ where }),
    ]);
    return {
      products: products.map((p) => this.toGrpcProduct(p)),
      total,
    };
  }

  async create(data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    category?: string;
    image?: string;
  }) {
    if (data.price <= 0) {
      throw new RpcException({
        code: 3,
        message: 'Price must be positive',
      });
    }
    if (data.stock < 0) {
      throw new RpcException({
        code: 3,
        message: 'Stock cannot be negative',
      });
    }
    try {
      const product = await this.prisma.product.create({
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          category: data.category,
          image: data.image,
        },
      });
      return this.toGrpcProduct(product);
    } catch (err) {
      const e = err as { code?: string };
      if (e.code === 'P2002') {
        throw new RpcException({
          code: 6,
          message: 'Product with this name already exists',
        });
      }

      throw err;
    }
  }

  async update(data: {
    id: string;
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    category?: string;
    image?: string;
  }) {
    if (data.price !== undefined && data.price <= 0) {
      throw new RpcException({
        code: 3,
        message: 'Price must be positive',
      });
    }
    if (data.stock !== undefined && data.stock < 0) {
      throw new RpcException({
        code: 3,
        message: 'Stock cannot be negative',
      });
    }
    const product = await this.prisma.product.findUnique({
      where: { id: data.id },
    });
    if (!product) {
      throw new RpcException({
        code: 5,
        message: 'Product not found',
      });
    }
    try {
      const updated = await this.prisma.product.update({
        where: { id: data.id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.description !== undefined && {
            description: data.description,
          }),
          ...(data.price !== undefined && { price: data.price }),
          ...(data.stock !== undefined && { stock: data.stock }),
          ...(data.category !== undefined && { category: data.category }),
          ...(data.image !== undefined && { image: data.image }),
        },
      });
      return this.toGrpcProduct(updated);
    } catch (err) {
      const e = err as { code?: string };
      if (e.code === 'P2002') {
        throw new RpcException({
          code: 6,
          message: 'Product with this name already exists',
        });
      }

      throw err;
    }
  }

  async delete(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new RpcException({
        code: 5,
        message: 'Product not found',
      });
    }
    await this.prisma.product.delete({
      where: { id },
    });
    return this.toGrpcProduct(product);
  }

  async checkStock(productId: string, quantity: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new RpcException({
        code: 5,
        message: 'Product not found',
      });
    }
    const available = product.stock >= quantity;
    return {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      stock: product.stock,
      available,
    };
  }

  async updateStock(productId: string, delta: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new RpcException({
        code: 5,
        message: 'Product not found',
      });
    }
    const newStock = product.stock + delta;
    if (newStock < 0) {
      throw new RpcException({
        code: 3,
        message: 'Insufficient stock',
      });
    }
    const updated = await this.prisma.product.update({
      where: { id: productId },
      data: { stock: newStock },
    });
    return this.toGrpcProduct(updated);
  }
}
