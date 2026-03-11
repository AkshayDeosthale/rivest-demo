import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ProductModule } from './product.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);
  const protoPath = join(process.cwd(), 'libs/shared/grpc/proto/product.proto');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'product',
      protoPath,
      url: process.env.GRPC_URL || '0.0.0.0:50051',
    },
  });

  await app.startAllMicroservices();
  const httpPort = process.env.HTTP_PORT || 3001;
  await app.listen(httpPort);
  console.log(`Product service gRPC running on :50051, HTTP on :${httpPort}`);
}
void bootstrap();
