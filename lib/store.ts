import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { User, Product, Order, OrderStatus } from '@prisma/client';
import { CartItem } from './types';

interface StoreState {
  // Auth
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  addUser: (userData: { name: string; email: string; password: string; role: string; }) => Promise<boolean>;
  logout: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;

  // Products
  products: Product[];
  fetchProducts: () => Promise<void>;
  fetchProductDetails: (productId: string) => Promise<Product | null>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Orders
  orders: Order[];
  buyerOrders: Order[];
  sellerOrders: Order[];
  fetchBuyerOrders: () => Promise<void>;
  fetchSellerOrders: () => Promise<void>;
  createOrder: () => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Auth
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      login: async (email, password) => {
        const loadingToast = toast.loading('Logging in...');
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            toast.dismiss(loadingToast);
            toast.error(data.error || 'Invalid credentials');
            return false;
          }

          set({ currentUser: data });
          toast.dismiss(loadingToast);
          toast.success('Logged in successfully!');
          return true;
        } catch (error) {
          console.error('Login error:', error);
          toast.dismiss(loadingToast);
          toast.error('Error logging in');
          return false;
        }
      },
      addUser: async (userData) => {
        const loadingToast = toast.loading('Creating account...');
        try {
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (!response.ok) {
            toast.dismiss(loadingToast);
            toast.error(data.error || 'Error creating account');
            return false;
          }

          toast.dismiss(loadingToast);
          toast.success('Account created successfully!');
          return true;
        } catch (error) {
          console.error('Signup error:', error);
          toast.dismiss(loadingToast);
          toast.error('Error creating account');
          return false;
        }
      },
      logout: () => {
        set({ currentUser: null });
        toast.success('Logged out successfully!');
      },

      // Cart
      cart: [],
      addToCart: (product, quantity) => {
        const cart = get().cart;
        const existingItem = cart.find((item) => item.productId === product.id);

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            cart: [...cart, { productId: product.id, quantity }],
          });
        }
        toast.success('Added to cart');
      },
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.productId !== productId),
        })),
      clearCart: () => set({ cart: [] }),
      updateCartItemQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        })),

      // Products
      products: [],
      fetchProducts: async () => {
        try {
          const state = get();
          const url = state.currentUser?.role === 'seller' 
            ? `/api/products?sellerId=${state.currentUser.id}` 
            : '/api/products';
            
          const response = await fetch(url);
          const data = await response.json();

          if (!response.ok) {
            toast.error(data.error || 'Error fetching products');
            return;
          }

          set({ products: data });
        } catch (error) {
          console.error('Error fetching products:', error);
          toast.error('Error fetching products');
        }
      },
      fetchProductDetails: async (productId) => {
        try {
          const response = await fetch(`/api/products/${productId}`);
          const data = await response.json();

          if (!response.ok) {
            toast.error(data.error || 'Error fetching product details');
            return null;
          }

          return data;
        } catch (error) {
          console.error('Error fetching product details:', error);
          toast.error('Error fetching product details');
          return null;
        }
      },
      addProduct: async (product) => {
        try {
          const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
          });
          const data = await response.json();

          if (!response.ok) {
            toast.error(data.error || 'Error adding product');
            return;
          }

          set((state) => ({ products: [...state.products, data] }));
          toast.success('Product added successfully');
        } catch (error) {
          console.error('Error adding product:', error);
          toast.error('Error adding product');
        }
      },
      updateProduct: async (id, product) => {
        try {
          const response = await fetch(`/api/products/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product),
          });
          const data = await response.json();

          if (!response.ok) {
            toast.error(data.error || 'Error updating product');
            return;
          }

          set((state) => ({
            products: state.products.map((p) => (p.id === id ? { ...p, ...data } : p)),
          }));
          toast.success('Product updated successfully');
        } catch (error) {
          console.error('Error updating product:', error);
          toast.error('Error updating product');
        }
      },
      deleteProduct: async (id) => {
        try {
          const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            const data = await response.json();
            toast.error(data.error || 'Error deleting product');
            return;
          }

          set((state) => ({
            products: state.products.filter((p) => p.id !== id),
          }));
          toast.success('Product deleted successfully');
        } catch (error) {
          console.error('Error deleting product:', error);
          toast.error('Error deleting product');
        }
      },

      // Orders
      orders: [],
      buyerOrders: [],
      sellerOrders: [],
      fetchBuyerOrders: async () => {
        try {
          const state = get();
          if (!state.currentUser) {
            toast.error('Please login first');
            return;
          }

          const response = await fetch(`/api/buyer/orders?buyerId=${state.currentUser.id}`);
          const data = await response.json();

          if (!response.ok) {
            toast.error(data.error || 'Error fetching orders');
            return;
          }

          set({ buyerOrders: data });
        } catch (error) {
          console.error('Error fetching buyer orders:', error);
          toast.error('Error fetching orders');
        }
      },
      fetchSellerOrders: async () => {
        try {
          const state = get();
          if (!state.currentUser || state.currentUser.role !== 'seller') {
            toast.error('Unauthorized');
            return;
          }

          const response = await fetch(`/api/seller/orders?sellerId=${state.currentUser.id}`);
          const data = await response.json();

          if (!response.ok) {
            toast.error(data.error || 'Error fetching orders');
            return;
          }

          set({ sellerOrders: data });
        } catch (error) {
          console.error('Error fetching seller orders:', error);
          toast.error('Error fetching orders');
        }
      },
      createOrder: async () => {
        const loadingToast = toast.loading('Creating order...');
        try {
          const state = get();
          if (!state.currentUser || !state.cart.length) {
            toast.dismiss(loadingToast);
            toast.error('Please login and add items to cart');
            return false;
          }

          // Group cart items by seller
          const itemsBySeller = state.cart.reduce((acc, item) => {
            const product = state.products.find(p => p.id === item.productId);
            if (!product) return acc;
            
            const sellerId = product.sellerId;
            if (!acc[sellerId]) {
              acc[sellerId] = [];
            }
            acc[sellerId].push(item);
            return acc;
          }, {} as Record<string, typeof state.cart>);

          // Create an order for each seller
          const orderPromises = Object.entries(itemsBySeller).map(([sellerId, items]) =>
            fetch('/api/buyer/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                buyerId: state.currentUser!.id,
                sellerId,
                items: items.map(item => ({
                  productId: item.productId,
                  quantity: item.quantity
                }))
              })
            }).then(r => r.json())
          );

          const orders = await Promise.all(orderPromises);

          set((state) => ({ 
            buyerOrders: [...orders, ...state.buyerOrders],
            cart: [] 
          }));
          toast.dismiss(loadingToast);
          toast.success('Orders created successfully!');
          return true;
        } catch (error) {
          console.error('Error creating orders:', error);
          toast.dismiss(loadingToast);
          toast.error('Error creating orders');
          return false;
        }
      },
      updateOrderStatus: async (orderId, status) => {
        try {
          const response = await fetch(`/api/orders/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
          });
          const data = await response.json();

          if (!response.ok) {
            toast.error(data.error || 'Error updating order status');
            return;
          }

          set((state) => ({
            orders: state.orders.map((o) =>
              o.id === orderId ? { ...o, status } : o
            ),
            buyerOrders: state.buyerOrders.map((o) =>
              o.id === orderId ? { ...o, status } : o
            ),
            sellerOrders: state.sellerOrders.map((o) =>
              o.id === orderId ? { ...o, status } : o
            ),
          }));
          toast.success('Order status updated successfully');
        } catch (error) {
          console.error('Error updating order status:', error);
          toast.error('Error updating order status');
        }
      },
    }),
    {
      name: 'store-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        cart: state.cart,
      }),
    }
  )
);

// Set up broadcast channel listener
if (typeof window !== 'undefined') {
  const channel = new BroadcastChannel('store_channel');
  channel.addEventListener('message', (event) => {
    const { type, ...data } = event.data;
    switch (type) {
      case 'UPDATE_CURRENT_USER':
        useStore.setState({ currentUser: data.currentUser });
        break;
      case 'UPDATE_CART':
        useStore.setState({ cart: data.cart });
        break;
      case 'UPDATE_ORDERS':
        useStore.setState({ orders: data.orders });
        break;
    }
  });
}