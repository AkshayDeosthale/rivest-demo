import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaService } from '../../../libs/prisma/src/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
      {
        name: 'PRODUCT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'product',
          protoPath: join(
            process.cwd(),
            'libs/shared/grpc/proto/product.proto',
          ),
          url: process.env.PRODUCT_GRPC_URL || 'localhost:50051',
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, PrismaService],
})
export class OrderModule {}
