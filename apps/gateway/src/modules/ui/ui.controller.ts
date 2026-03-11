import { Controller, Get, Param, Req, Render, UseGuards } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Request } from 'express';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

interface ReqUser {
  id: string;
  email: string;
}

@Controller()
export class UiController {
  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @Render('home')
  index(@Req() req: Request) {
    const user = (req as Request & { user?: ReqUser }).user || null;
    return { user };
  }

  @Get('signup')
  @Render('signup')
  signup() {
    const configPath = join(
      process.cwd(),
      'libs/shared/constants/form-config.json',
    );
    const formConfig = JSON.parse(readFileSync(configPath, 'utf-8')) as {
      data: unknown[];
    };
    return { formConfig };
  }

  @Get('login')
  @Render('login')
  login() {
    return {};
  }

  @Get('products/create')
  @UseGuards(OptionalJwtAuthGuard)
  @Render('product-create')
  productCreate(@Req() req: Request) {
    const user = (req as Request & { user?: ReqUser }).user || null;
    return { user };
  }

  @Get('products/:id')
  @UseGuards(OptionalJwtAuthGuard)
  @Render('product-detail')
  productDetail(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const user = (req as Request & { user?: ReqUser }).user || null;
    return { productId: id, user };
  }

  @Get('cart')
  @UseGuards(OptionalJwtAuthGuard)
  @Render('cart')
  cart(@Req() req: Request) {
    const user = (req as Request & { user?: ReqUser }).user || null;
    return { user };
  }

  @Get('checkout')
  @UseGuards(OptionalJwtAuthGuard)
  @Render('checkout')
  checkout(@Req() req: Request) {
    const user = (req as Request & { user?: ReqUser }).user || null;
    return { user };
  }

  @Get('payment-success')
  @UseGuards(OptionalJwtAuthGuard)
  @Render('payment-success')
  paymentSuccess(@Req() req: Request) {
    const user = (req as Request & { user?: ReqUser }).user || null;
    return { user };
  }

  @Get('orders/history')
  @UseGuards(OptionalJwtAuthGuard)
  @Render('purchase-history')
  purchaseHistory(@Req() req: Request) {
    const user = (req as Request & { user?: ReqUser }).user || null;
    return { user };
  }
}
