import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from '../../../libs/prisma/src/prisma.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [ProductController],
  providers: [ProductService, PrismaService],
})
export class ProductModule {}
