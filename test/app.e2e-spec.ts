import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import type { Server } from 'http';
import { join } from 'path';
import request from 'supertest';
import { AppModule } from '../apps/gateway/src/app.module';
import { ProductsService } from '../apps/gateway/src/modules/services/products.service';
import { OrdersService } from '../apps/gateway/src/modules/services/orders.service';
import { PrismaService } from '../libs/prisma/src/prisma.service';

const mockPrismaService = {
  $connect: jest.fn().mockResolvedValue(undefined),
  $disconnect: jest.fn().mockResolvedValue(undefined),
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

const mockProductsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockOrdersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
};

describe('Gateway (e2e)', () => {
  let app: INestApplication & NestExpressApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideProvider(ProductsService)
      .useValue(mockProductsService)
      .overrideProvider(OrdersService)
      .useValue(mockOrdersService)
      .compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    app.useStaticAssets(join(__dirname, '../apps/gateway/public'));
    app.setBaseViewsDir(join(__dirname, '../apps/gateway/views'));
    app.setViewEngine('hbs');
    await app.init();
  });

  afterEach(async () => {
    await app?.close();
  });

  it('/ (GET)', () => {
    const server = app.getHttpServer() as Server;
    return request(server).get('/').expect(200);
  });
});
