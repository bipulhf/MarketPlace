'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Order, CartItem, Product } from '@/lib/types';

interface OrderItemWithProduct extends CartItem {
  product: Product;
}

interface OrderWithProducts extends Order {
  items: OrderItemWithProduct[];
}

export default function OrdersPage() {
  const { currentUser, buyerOrders, fetchBuyerOrders, products, isLoadingOrders } = useStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const loadOrders = async () => {
      if (currentUser) {
        await fetchBuyerOrders();
      }
      setIsLoading(false);
    };
    loadOrders();
  }, [currentUser, fetchBuyerOrders, router]);

  if (!currentUser) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">Please login to view your orders</div>
      </div>
    );
  }

  if (isLoading || isLoadingOrders) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading orders...</span>
          </div>
        </div>
      </div>
    );
  }

  // Transform orders to include product information
  const ordersWithProducts: OrderWithProducts[] = buyerOrders.map(order => ({
    ...order,
    items: order.items.map(item => ({
      ...item,
      product: products.find(p => p.id === item.productId)!
    }))
  }));

  if (!ordersWithProducts.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
            <p className="text-gray-600">You haven't placed any orders yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
        <div className="space-y-6">
          {ordersWithProducts.map((order) => (
            <Card key={order.id} className="p-6">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Order #{order.id.slice(0, 8)}</span>
                  <Badge variant={
                    order.status === 'accepted' ? 'default' :
                    order.status === 'pending' ? 'secondary' :
                    order.status === 'delivered' ? 'default' :
                    'destructive'
                  }>
                    {order.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Order Details</h3>
                    <p className="text-sm text-gray-600">
                      Placed on {format(new Date(order.createdAt), 'yyyy-MM-dd')}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total: ৳{order.total.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Items</h3>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.productId} className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity} × ৳{item.product.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between">
                    <p className="font-semibold">Total Amount</p>
                    <p className="font-semibold">
                      ৳{order.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
