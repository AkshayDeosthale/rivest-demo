import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { OrderModule } from './order.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  const protoPath = join(process.cwd(), 'libs/shared/grpc/proto/order.proto');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'order',
      protoPath,
      url: process.env.GRPC_URL || '0.0.0.0:50052',
    },
  });

  await app.startAllMicroservices();
  const httpPort = process.env.HTTP_PORT || 3002;
  await app.listen(httpPort);
  console.log(`Order service gRPC running on :50052, HTTP on :${httpPort}`);
}
void bootstrap();
