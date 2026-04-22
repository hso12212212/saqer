export type Category =
  | 'خيام'
  | 'كراسي'
  | 'طاولات'
  | 'إضاءة'
  | 'طبخ'
  | 'نوم'
  | 'إكسسوارات';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: Category;
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  description: string;
  features: string[];
  colors?: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}
