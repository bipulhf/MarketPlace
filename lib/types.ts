export type UserRole = 'buyer' | 'seller';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export type OrderStatus = 'pending' | 'accepted' | 'shipping' | 'delivered';

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}