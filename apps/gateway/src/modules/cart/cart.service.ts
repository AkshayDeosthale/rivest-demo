import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../libs/prisma/src/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async addItem(userId: string, productId: string, quantity: number) {
    const existing = await this.prisma.cart.findFirst({
      where: { userId, productId },
    });
    if (existing) {
      return this.prisma.cart.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    }
    return this.prisma.cart.create({
      data: { userId, productId, quantity },
    });
  }

  async getItems(userId: string) {
    return this.prisma.cart.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async removeItem(id: string, userId: string) {
    const item = await this.prisma.cart.findFirst({
      where: { id, userId },
    });
    if (!item) return null;
    return this.prisma.cart.delete({ where: { id } });
  }

  async clearCart(userId: string) {
    return this.prisma.cart.deleteMany({ where: { userId } });
  }

  async getCount(userId: string): Promise<number> {
    return this.prisma.cart.count({ where: { userId } });
  }

  async updateQuantity(id: string, userId: string, quantity: number) {
    const item = await this.prisma.cart.findFirst({
      where: { id, userId },
    });
    if (!item) return null;
    return this.prisma.cart.update({
      where: { id },
      data: { quantity },
    });
  }
}
