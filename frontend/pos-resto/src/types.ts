export type OrderType = 'delivery' | 'onplace' | 'glovo';

export interface Category {
  id: string;
  name: string;
}

export type Product = {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  image?: string;        // <-- nouveau
  description?: string;  // <-- nouveau
};


export interface CartLine {
  product: Product;
  qty: number;
}

