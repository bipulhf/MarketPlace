'use client';

import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

export default function BuyerDashboard() {
  const router = useRouter();
  const products = useStore(state => state.products);
  const addToCart = useStore(state => state.addToCart);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Available Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {products.map((product: Product) => (
          <Card key={product.id} className="p-3 sm:p-4">
            <div 
              className="aspect-square sm:aspect-video relative mb-3 sm:mb-4 hover:cursor-pointer" 
              onClick={() => router.push(`/product/${product.id}`)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full rounded-md"
              />
            </div>
            <div>
              <h3 className="font-semibold text-sm sm:text-base">{product.name}</h3>
              <p className="text-gray-600 text-sm sm:text-base">৳{product.price.toFixed(2)}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 line-clamp-2">{product.description}</p>
              <Button
                onClick={() => addToCart(product, 1)}
                className="w-full mt-3 sm:mt-4 text-sm sm:text-base"
              >
                <ShoppingCart className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Add to Cart
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}