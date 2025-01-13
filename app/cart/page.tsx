'use client';

import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { cart, products, removeFromCart, updateCartItemQuantity } = useStore();
  const router = useRouter();
  const { isLoading, user } = useRequireAuth('buyer');

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center min-h-[200px]">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== 'buyer') {
    return null; // Will redirect via useRequireAuth
  }

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      product,
      total: (product?.price || 0) * item.quantity
    };
  });

  const total = cartItems.reduce((sum, item) => sum + item.total, 0);

  if (cart.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-4"
      >
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-2xl font-bold mb-4"
        >
          Your Cart
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Your cart is empty.
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4"
    >
      <motion.h1 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-2xl font-bold mb-4"
      >
        Your Cart
      </motion.h1>
      <AnimatePresence mode="popLayout">
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between border p-4 rounded"
            >
              <motion.div 
                className="flex items-center space-x-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {item.product?.image && (
                  <motion.img 
                    whileHover={{ scale: 1.1 }}
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-16 h-16 object-cover rounded" 
                  />
                )}
                <div>
                  <h3 className="font-semibold">{item.product?.name}</h3>
                  <p className="text-gray-600">৳{item.product?.price}</p>
                </div>
              </motion.div>
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateCartItemQuantity(item.productId, Math.max(1, item.quantity - 1))}
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)}
                  >
                    +
                  </Button>
                </motion.div>
                <motion.p 
                  className="font-semibold"
                  whileHover={{ scale: 1.1 }}
                >
                  ৳{item.total.toFixed(2)}
                </motion.p>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    Remove
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 flex justify-between items-center"
      >
        <motion.div whileHover={{ scale: 1.05 }}>
          <p className="text-xl font-bold">Total: ৳{total.toFixed(2)}</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            onClick={() => router.push('/checkout')}
          >
            Proceed to Checkout
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
