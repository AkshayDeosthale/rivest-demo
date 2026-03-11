import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('api/cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  addItem(
    @CurrentUser() user: { id: string },
    @Body() dto: AddToCartDto,
  ) {
    return this.cartService.addItem(user.id, dto.productId, dto.quantity);
  }

  @Get()
  getItems(@CurrentUser() user: { id: string }) {
    return this.cartService.getItems(user.id);
  }

  @Get('count')
  getCount(@CurrentUser() user: { id: string }) {
    return this.cartService.getCount(user.id);
  }

  @Delete(':id')
  removeItem(
    @CurrentUser() user: { id: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.cartService.removeItem(id, user.id);
  }

  @Delete()
  clearCart(@CurrentUser() user: { id: string }) {
    return this.cartService.clearCart(user.id);
  }
}
