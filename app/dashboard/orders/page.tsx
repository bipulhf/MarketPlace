'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Order, CartItem, Product } from '@/lib/types';

interface OrderItemWithProduct extends CartItem {
  product: Product;
}

interface OrderWithProducts extends Order {
  items: OrderItemWithProduct[];
}

export default function OrdersPage() {
  const { currentUser, buyerOrders, fetchBuyerOrders, products } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (currentUser) {
        await fetchBuyerOrders();
      }
      setIsLoading(false);
    };
    loadOrders();
  }, [currentUser, fetchBuyerOrders]);  

  if (!currentUser) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">Please login to view your orders</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">Loading orders...</div>
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <div className="grid gap-4">
        {ordersWithProducts && ordersWithProducts.length > 0 ? (
          ordersWithProducts.map((order) => (
            <Card key={order.id}>
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
                        <div key={item.productId} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium">
                          ৳{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No orders found
          </div>
        )}
      </div>
    </div>
  );
}
