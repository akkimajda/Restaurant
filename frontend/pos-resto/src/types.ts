export type OrderType = 'delivery' | 'onplace' | 'glovo';

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  img?: string;
}

export interface CartLine {
  product: Product;
  qty: number;
}
