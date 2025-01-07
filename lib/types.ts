export type UserRole = 'buyer' | 'seller' | 'delivery';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  sellerId: string;
  image: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type OrderStatus = 'pending' | 'accepted' | 'shipping' | 'delivered';

export interface Order {
  id: string;
  buyerId: string;
  items: CartItem[];
  status: OrderStatus;
  sellerId: string;
  deliveryManId?: string;
  createdAt: string;
  total: number;
}