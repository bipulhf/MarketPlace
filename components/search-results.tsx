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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
      {results.map((product) => (
        <Card
          key={product.id}
          className="overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div
            className="aspect-video relative cursor-pointer"
            onClick={() => router.push(`/product/${product.id}`)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-4">
              <h3
                className="font-semibold hover:underline cursor-pointer"
                onClick={() => router.push(`/product/${product.id}`)}
              >
                {product.name}
              </h3>
              <p className="font-medium">৳{product.price.toFixed(2)}</p>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
              {product.description}
            </p>
            <Button
              className="w-full mt-4"
              onClick={() => handleAddToCart(product)}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
