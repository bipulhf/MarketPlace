'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, clearCart } = useStore();

  useEffect(() => {
    const updateOrders = async () => {
      try {
        // Update orders status to paid
        const response = await fetch('/api/orders/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: currentUser?.id,
            status: 'paid'
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update order status');
        }

        clearCart();
        toast.success('Payment successful! Your order has been confirmed.');
      } catch (error) {
        console.error('Error updating order status:', error);
        toast.error('There was an issue confirming your order. Please contact support.');
      }
    };

    const sessionId = searchParams.get('session_id');
    if (sessionId && currentUser) {
      updateOrders();
    }
  }, [searchParams, currentUser, clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            <Button onClick={() => router.push('/dashboard/orders')} className="w-full">
              View Orders
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
