export type ProductType = 'digital' | 'physical';
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  discount_price: number | null;
  product_type: ProductType;
  category_id: string | null;
  stock_quantity: number;
  is_active: boolean;
  featured: boolean;
  image_url: string | null;
  gallery_urls: string[] | null;
  file_url: string | null;
  file_name: string | null;
  specifications: Record<string, string> | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Order {
  id: string;
  user_id: string | null;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  discount_amount: number;
  shipping_amount: number;
  final_amount: number;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_postal_code: string | null;
  phone: string | null;
  notes: string | null;
  tracking_code: string | null;
  payment_reference: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_type: ProductType;
  quantity: number;
  unit_price: number;
  total_price: number;
  file_url: string | null;
  created_at: string;
  product?: Product;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}
