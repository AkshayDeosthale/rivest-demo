import { Module } from '@nestjs/common';
import { GrpcClientsModule } from '../../grpc-clients.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [GrpcClientsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
