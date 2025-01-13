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
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Available Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: Product) => (
          <Card key={product.id} className="p-4">
            <div className="aspect-video relative mb-4 hover:cursor-pointer" onClick={() => router.push(`/product/${product.id}`)}>
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full rounded-md"
              />
            </div>
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-gray-600">৳{product.price}</p>
              <p className="text-sm text-gray-500 mt-2">{product.description}</p>
              <Button
                onClick={() => addToCart(product, 1)}
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