'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { randomDelay } from '@/lib/delay';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const fetchProductDetails = useStore((state) => state.fetchProductDetails);
  const addToCart = useStore((state) => state.addToCart);
  const currentUser = useStore((state) => state.currentUser);

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      const productData = await fetchProductDetails(params.id as string);
      if (productData) {
        setProduct(productData);
      } else {
        toast.error('Product not found');
        router.push('/');
      }
      setIsLoading(false);
    };
    
    loadProduct();
  }, [params.id, fetchProductDetails, router]);

  const handleAddToCart = async () => {
    if (!currentUser) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }

    if (!product) return;
    
    setIsAddingToCart(true);
    await randomDelay(500, 1000);
    addToCart(product, 1);
    setIsAddingToCart(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-[400px] w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => router.push('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-8"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <p className="text-2xl font-semibold mt-4">৳{product.price}</p>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Description</h2>
                  <p className="text-gray-600">{product.description}</p>
                </div>

                <div className="mt-8">
                  <Button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="w-full"
                  >
                    {isAddingToCart ? (
                      'Adding to Cart...'
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
