'use client';

import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface SearchResultsProps {
  results: Product[];
}

export function SearchResults({ results }: SearchResultsProps) {
  const router = useRouter();
  const addToCart = useStore((state) => state.addToCart);

  if (!results.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found</p>
      </div>
    );
  }

  const handleAddToCart = async (product: Product) => {
    if (!product) {
      return;
    }
    
    addToCart(product, 1);
    toast.success('Added to cart successfully');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-8">
      {results.map((product) => (
        <Card
          key={product.id}
          className="overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div
            className="aspect-square sm:aspect-video relative cursor-pointer"
            onClick={() => router.push(`/product/${product.id}`)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-4">
              <h3
                className="font-semibold hover:underline cursor-pointer text-sm sm:text-base mb-1 sm:mb-0"
                onClick={() => router.push(`/product/${product.id}`)}
              >
                {product.name}
              </h3>
              <p className="font-medium text-sm sm:text-base">৳{product.price.toFixed(2)}</p>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1 sm:mt-2">
              {product.description}
            </p>
            <Button
              className="w-full mt-3 sm:mt-4 text-sm sm:text-base"
              onClick={() => handleAddToCart(product)}
            >
              <ShoppingCart className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Add to Cart
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
