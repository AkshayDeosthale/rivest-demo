import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../../../../../libs/prisma/src/prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [CartController],
  providers: [CartService, PrismaService],
  exports: [CartService],
})
export class CartModule {}
