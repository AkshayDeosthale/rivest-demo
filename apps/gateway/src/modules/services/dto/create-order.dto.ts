import {
  IsString,
  IsNumber,
  Min,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
