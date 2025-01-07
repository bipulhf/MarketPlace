'use client';

import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function CartPage() {
  const { cart, products, removeFromCart, updateCartQuantity } = useStore();
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
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="space-y-4">
        {cartItems.map(item => (
          <div key={item.productId} className="flex items-center justify-between border p-4 rounded">
            <div className="flex items-center space-x-4">
              {item.product?.image && (
                <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
              )}
              <div>
                <h3 className="font-semibold">{item.product?.name}</h3>
                <p className="text-gray-600">${item.product?.price}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateCartQuantity(item.productId, Math.max(1, item.quantity - 1))}
                >
                  -
                </Button>
                <span>{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                >
                  +
                </Button>
              </div>
              <p className="font-semibold">${item.total.toFixed(2)}</p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeFromCart(item.productId)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between items-center">
        <div>
          <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
        </div>
        <Button
          size="lg"
          onClick={() => router.push('/checkout')}
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}
