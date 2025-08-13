import type { Category, Product } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'all',   name: 'All items' },
  { id: 'starter', name: 'Starter' },
  { id: 'sushi',   name: 'Sushi' },
  { id: 'salad',   name: 'Salad' },
  { id: 'drink',   name: 'Drinks' },
];

export const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Soupe Miso',      price: 45, categoryId: 'starter' },
  { id: 'p2', name: 'Gyoza',           price: 60, categoryId: 'starter' },
  { id: 'p3', name: 'California Roll', price: 80, categoryId: 'sushi'   },
  { id: 'p4', name: 'Crunchy Roll',    price: 90, categoryId: 'sushi'   },
  { id: 'p5', name: 'Salade Wakame',   price: 50, categoryId: 'salad'   },
  { id: 'p6', name: 'Salade Veggie',   price: 60, categoryId: 'salad'   },
  { id: 'p7', name: 'Soda',            price: 20, categoryId: 'drink'   },
  { id: 'p8', name: 'Jus / mocktail',  price: 35, categoryId: 'drink'   },
];
