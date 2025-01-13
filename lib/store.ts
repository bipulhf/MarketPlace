import { create } from 'zustand';
import { User, Product, Order, CartItem } from './types';
import { persist, createJSONStorage } from 'zustand/middleware';

// Create a broadcast channel for cross-tab communication
const channel = typeof window !== 'undefined' ? new BroadcastChannel('store_channel') : null;

interface StoreState {
  // Auth
  users: User[];
  currentUser: User | null;
  addUser: (user: Omit<User, 'id'>) => boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Orders
  orders: Order[];
  createOrder: () => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const useStore = create(
  persist<StoreState>(
    (set, get) => {
      console.log('Initializing store...');
      return {
        // Auth
        users: [
          {
            id: 'buyer1',
            email: 'bipulhf@gmail.com',
            password: '1234',
            name: 'Bipul',
            role: 'buyer'
          },
          {
            id: 'seller1',
            email: 'shifat@gmail.com',
            password: '1234',
            name: 'Shifat',
            role: 'seller'
          },
          {
            id: 'delivery1',
            email: 'delivery@gmail.com',
            password: '1234',
            name: 'Bob Delivery',
            role: 'delivery'
          }
        ],
        currentUser: null,
        addUser: (userData) => {
          let success = false;
          set((state) => {
            const exists = state.users.some(user => user.email === userData.email);
            if (!exists) {
              success = true;
              const newState = {
                users: [...state.users, { ...userData, id: Math.random().toString(36).slice(2) }]
              };
              channel?.postMessage({ type: 'UPDATE_USERS', users: newState.users });
              return newState;
            }
            return state;
          });
          return success;
        },
        login: (email, password) => {
          let success = false;
          set((state) => {
            const user = state.users.find(u => u.email === email && u.password === password);
            if (user) {
              success = true;
              channel?.postMessage({ type: 'UPDATE_CURRENT_USER', currentUser: user });
              return { currentUser: user };
            }
            return state;
          });
          return success;
        },
        logout: () => {
          set({ currentUser: null });
          channel?.postMessage({ type: 'UPDATE_CURRENT_USER', currentUser: null });
        },

        // Products
        products: [
          {
            id: 'prod1',
            name: 'Premium Leather Wallet',
            price: 4990,
            description: 'Handcrafted genuine leather wallet with multiple card slots',
            sellerId: 'seller1',
            image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=600'
          },
          {
            id: 'prod2',
            name: 'Wireless Earbuds',
            price: 12000,
            description: 'High-quality wireless earbuds with noise cancellation',
            sellerId: 'seller1',
            image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600'
          },
          {
            id: 'prod3',
            name: 'Smart Watch',
            price: 10000,
            description: 'Feature-rich smartwatch with health tracking',
            sellerId: 'seller1',
            image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600'
          }
        ],
        addProduct: (product) => set((state) => ({
          products: [...state.products, { ...product, id: Math.random().toString(36).slice(2) }]
        })),
        updateProduct: (id, updates) => set((state) => ({
          products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
        })),
        deleteProduct: (id) => set((state) => ({
          products: state.products.filter(p => p.id !== id)
        })),

        // Cart
        cart: [],
        addToCart: (productId) => set((state) => {
          const newCart = [...state.cart, { productId, quantity: 1 }];
          channel?.postMessage({ type: 'UPDATE_CART', cart: newCart });
          return { cart: newCart };
        }),
        removeFromCart: (productId) => set((state) => {
          const newCart = state.cart.filter(item => item.productId !== productId);
          channel?.postMessage({ type: 'UPDATE_CART', cart: newCart });
          return { cart: newCart };
        }),
        updateCartQuantity: (productId, quantity) => set((state) => {
          const newCart = state.cart.map(item => 
            item.productId === productId ? { ...item, quantity } : item
          );
          channel?.postMessage({ type: 'UPDATE_CART', cart: newCart });
          return { cart: newCart };
        }),
        clearCart: () => {
          set({ cart: [] });
          channel?.postMessage({ type: 'UPDATE_CART', cart: [] });
        },

        // Orders
        orders: [
          {
            id: 'order1',
            buyerId: 'buyer1',
            items: [{ productId: 'prod1', quantity: 2 }],
            status: 'delivered',
            sellerId: 'seller1',
            createdAt: '2025-01-10T10:30:00+06:00',
            total: 9980
          },
          {
            id: 'order2',
            buyerId: 'buyer1',
            items: [{ productId: 'prod2', quantity: 1 }],
            status: 'shipping',
            sellerId: 'seller1',
            createdAt: '2025-01-11T15:45:00+06:00',
            total: 12000
          },
          {
            id: 'order3',
            buyerId: 'buyer1',
            items: [{ productId: 'prod3', quantity: 1 }],
            status: 'accepted',
            sellerId: 'seller1',
            createdAt: '2025-01-12T09:20:00+06:00',
            total: 10000
          },
          {
            id: 'order4',
            buyerId: 'buyer1',
            items: [
              { productId: 'prod1', quantity: 1 },
              { productId: 'prod2', quantity: 1 }
            ],
            status: 'pending',
            sellerId: 'seller1',
            createdAt: '2025-01-13T14:15:00+06:00',
            total: 16990
          }
        ],
        createOrder: () => set((state) => {
          if (!state.currentUser || !state.cart.length) return state;

          const items = state.cart;
          const total = items.reduce((sum, item) => {
            const product = state.products.find(p => p.id === item.productId);
            return sum + (product?.price || 0) * item.quantity;
          }, 0);

          const newOrder = {
            id: Math.random().toString(36).slice(2),
            buyerId: state.currentUser.id,
            items,
            status: 'pending' as const,
            sellerId: items[0]?.productId ? state.products.find(p => p.id === items[0].productId)?.sellerId || '' : '',
            createdAt: new Date().toISOString(),
            total
          };

          const newOrders = [...state.orders, newOrder];
          channel?.postMessage({ type: 'UPDATE_ORDERS', orders: newOrders });
          return { orders: newOrders };
        }),
        updateOrderStatus: (orderId, status) => set((state) => {
          const newOrders = state.orders.map(order =>
            order.id === orderId ? { ...order, status } : order
          );
          channel?.postMessage({ type: 'UPDATE_ORDERS', orders: newOrders });
          return { orders: newOrders };
        })
      }
    },
    {
      name: 'store-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

// Set up broadcast channel listener
if (typeof window !== 'undefined') {
  channel?.addEventListener('message', (event) => {
    const { type, ...data } = event.data;
    switch (type) {
      case 'UPDATE_USERS':
        useStore.setState({ users: data.users });
        break;
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