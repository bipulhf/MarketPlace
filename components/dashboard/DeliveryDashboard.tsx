"use client";

import { useStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck } from 'lucide-react';

export default function DeliveryDashboard() {
  const currentUser = useStore(state => state.currentUser);
  const orders = useStore(state => state.orders);
  const updateOrderStatus = useStore(state => state.updateOrderStatus);

  const deliverableOrders = orders.filter(
    order => order.status === 'accepted' || 
    (order.status === 'shipping' && order.deliveryManId === currentUser?.id)
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Deliverable Orders</h1>
      <div className="space-y-4">
        {deliverableOrders.map(order => (
          <Card key={order.id} className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">Total: ${order.total}</p>
              </div>
              <div>
                {order.status === 'accepted' && (
                  <Button
                    onClick={() => updateOrderStatus(order.id, 'shipping')}
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    Pick Up Order
                  </Button>
                )}
                {order.status === 'shipping' && (
                  <Button
                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    Mark as Delivered
                  </Button>
                )}
                <p className="text-sm font-medium mt-2">
                  Status: {order.status}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}