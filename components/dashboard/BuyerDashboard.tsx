"use client";

import { useStore } from '@/lib/store';
import { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BuyerDashboard() {
  const products = useStore(state => state.products);
  const addToCart = useStore(state => state.addToCart);
  const router = useRouter();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Available Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product: Product) => (
          <Card key={product.id} className="overflow-hidden" onClick={() => router.push(`/product/${product.id}`)}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">${product.price}</p>
              <p className="text-sm text-gray-500 mt-2">{product.description}</p>
              <Button
                onClick={() => addToCart(product.id)}
                className="w-full mt-4"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}