export interface CreateOrderRequest {
  productId: string;
  quantity: number;
  userId: string;
  address?: string;
  phone?: string;
}

export interface FindOneOrderRequest {
  id: string;
}

export interface FindAllOrdersRequest {
  page?: number;
  limit?: number;
}

export interface FindAllByUserRequest {
  userId: string;
  page?: number;
  limit?: number;
}
