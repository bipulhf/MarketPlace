'use client';

import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function CheckoutPage() {
  const { cart, products, createOrder, currentUser, clearCart } = useStore();
  const router = useRouter();

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      product,
      total: (product?.price || 0) * item.quantity
    };
  });

  const total = cartItems.reduce((sum, item) => sum + item.total, 0);

  if (!currentUser) {
    router.push('/login');
    return null;
  }

  if (currentUser.role !== 'buyer') {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>Only buyers can access the checkout page.</p>
      </div>
    );
  }

  if (cart.length === 0) {
    router.push('/cart');
    return null;
  }

  const handlePlaceOrder = () => {
    router.push('/payment');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="space-y-4">
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Order Summary</h2>
          {cartItems.map(item => (
            <div key={item.productId} className="flex justify-between py-2">
              <div>
                <p>{item.product?.name}</p>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
              </div>
              <p className="font-semibold">${item.total.toFixed(2)}</p>
            </div>
          ))}
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between">
              <p className="font-bold">Total</p>
              <p className="font-bold">${total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Shipping Information</h2>
          <p>{currentUser.name}</p>
          <p>{currentUser.email}</p>
        </div>

        <div className="flex justify-end mt-8">
          <Button
            size="lg"
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}
