'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card className="p-6 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
            <p className="text-gray-600 mb-6">
              Your payment was cancelled. No charges were made.
            </p>
            <div className="space-y-3">
              <Button onClick={() => router.push('/payment')} className="w-full">
                Try Again
              </Button>
              <Button 
                onClick={() => router.push('/cart')} 
                variant="outline" 
                className="w-full"
              >
                Return to Cart
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
