'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Banknote } from 'lucide-react';

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
      product,
      total: (product?.price || 0) * item.quantity
    };
  });

  const total = cartItems.reduce((sum, item) => sum + item.total, 0);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    createOrder();
    clearCart();
    router.push('/orders');
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
              <CardContent className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.productId} className="flex justify-between">
                    <span>{item.product?.name} (x{item.quantity})</span>
                    <span>${item.total.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-4 font-bold flex justify-between">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card>
              <CardHeader className="text-lg font-semibold">Payment Method</CardHeader>
              <CardContent>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
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
            </Card>

            {/* Payment Details */}
            {paymentMethod === 'card' && (
              <Card>
                <CardHeader className="text-lg font-semibold">Card Details</CardHeader>
                <form onSubmit={handlePayment}>
                  <CardContent className="space-y-4">
                    <div>
                      <Input
                        placeholder="Card Number"
                        required
                        maxLength={16}
                        pattern="[0-9]*"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="MM/YY"
                        required
                        maxLength={5}
                        pattern="[0-9/]*"
                      />
                      <Input
                        placeholder="CVC"
                        required
                        maxLength={3}
                        pattern="[0-9]*"
                      />
                    </div>
                    <Input
                      placeholder="Cardholder Name"
                      required
                    />
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            )}

            {/* Cash on Delivery */}
            {paymentMethod === 'cash' && (
              <Card>
                <CardContent className="text-center py-6">
                  <p className="mb-4">You will pay ${total.toFixed(2)} upon delivery</p>
                  <Button 
                    onClick={handlePayment} 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Confirm Order'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
