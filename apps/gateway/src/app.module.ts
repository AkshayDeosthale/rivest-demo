import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GrpcExceptionFilter } from './common/filters/grpc-exception.filter';
import { NotFoundExceptionFilter } from './common/filters/not-found-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ViewAuthMiddleware } from './common/middleware/view-auth.middleware';
import { GrpcClientsModule } from './grpc-clients.module';
import { AuthModule } from './modules/auth/auth.module';
import { UiModule } from './modules/ui/ui.module';
import { ProductsModule } from './modules/services/products.module';
import { OrdersModule } from './modules/services/orders.module';
import { CartModule } from './modules/cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    GrpcClientsModule,
    AuthModule,
    UiModule,
    ProductsModule,
    OrdersModule,
    CartModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GrpcExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ViewAuthMiddleware)
      .forRoutes('products/create', 'cart', 'checkout', 'orders/history');
  }
}
