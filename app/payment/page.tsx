'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Banknote, Loader2 } from 'lucide-react';
import { getStripe } from '@/lib/stripe';
import { toast } from 'sonner';

export default function PaymentPage() {
  const { cart, products, createOrder, currentUser, clearCart } = useStore();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  if (!currentUser || currentUser.role !== 'buyer') {
    router.push('/login');
    return null;
  }

  if (cart.length === 0) {
    router.push('/cart');
    return null;
  }

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      name: product?.name || '',
      image: product?.image || '',
      price: product?.price || 0,
      total: (product?.price || 0) * item.quantity
    };
  });

  const total = cartItems.reduce((sum, item) => sum + item.total, 0);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (paymentMethod === 'card') {
        // Create Stripe checkout session first
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: cartItems,
            userId: currentUser.id,
          }),
        });

        const { sessionId, error } = await response.json();

        if (error) {
          toast.error('Payment failed. Please try again.');
          return;
        }

        // Create order
        const orderCreated = await createOrder();
        if (!orderCreated) {
          toast.error('Failed to create order');
          return;
        }

        // Redirect to Stripe checkout
        const stripe = await getStripe();
        await stripe!.redirectToCheckout({
          sessionId,
        });
      } else {
        // Handle cash on delivery
        const orderCreated = await createOrder();
        if (orderCreated) {
          clearCart();
          router.push('/orders');
          toast.success('Order placed successfully!');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Payment</h1>

          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader className="text-lg font-semibold">Order Summary</CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.productId} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium">৳{item.total.toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between">
                      <p className="font-bold">Total</p>
                      <p className="font-bold">৳{total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card>
              <CardHeader className="text-lg font-semibold">Payment Method</CardHeader>
              <CardContent>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">
                      <div className="flex items-center">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Credit/Debit Card
                      </div>
                    </SelectItem>
                    <SelectItem value="cash">
                      <div className="flex items-center">
                        <Banknote className="w-4 h-4 mr-2" />
                        Cash on Delivery
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ৳${total.toFixed(2)}`
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
