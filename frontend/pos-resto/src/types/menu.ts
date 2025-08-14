export type MenuCategory = {
  id: number; name: string; sort_order: number; is_active: boolean;
};
export type MenuItem = {
  id: number; category_id: number; name: string; price: number;
  image_url?: string | null; sort_order: number; is_active: boolean;
};

