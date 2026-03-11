import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsNotEmpty,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0.01)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsString()
  @IsOptional()
  category?: string;
}
