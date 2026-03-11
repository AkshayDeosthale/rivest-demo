import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
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
      {
        name: 'ORDER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'order',
          protoPath: join(
            process.cwd(),
            'libs/shared/grpc/proto/order.proto',
          ),
          url: process.env.ORDER_GRPC_URL || 'localhost:50052',
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcClientsModule {}
