export interface FindOneRequest {
  id: string;
}

export interface FindAllRequest {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  image?: string;
}

export interface UpdateProductRequest {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  image?: string;
}

export interface DeleteProductRequest {
  id: string;
}

export interface CheckStockRequest {
  productId: string;
  quantity: number;
}

export interface UpdateStockRequest {
  productId: string;
  delta: number;
}
