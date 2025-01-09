'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

interface SearchResultsProps {
  results: Product[];
}

export function SearchResults({ results }: SearchResultsProps) {
  const router = useRouter();
  const addToCart = useStore((state) => state.addToCart);
  const currentUser = useStore((state) => state.currentUser);

  if (results.length === 0) {
    return null;
  }

  const handleAddToCart = (productId: string) => {
    if (!currentUser) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }
    
    addToCart(productId);
    toast.success('Added to cart successfully');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div 
              className="aspect-square relative mb-4 bg-muted rounded-lg cursor-pointer"
              onClick={() => router.push(`/product/${product.id}`)}
            >
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <div>
              <h3 
                className="font-semibold text-lg truncate cursor-pointer hover:text-primary"
                onClick={() => router.push(`/product/${product.id}`)}
              >
                {product.name}
              </h3>
              <p className="font-medium">${product.price.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                {product.description}
              </p>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => router.push(`/product/${product.id}`)}
            >
              View Details
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={() => handleAddToCart(product.id)}
            >
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
