'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { randomDelay } from '@/lib/delay';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const fetchProductDetails = useStore((state) => state.fetchProductDetails);
  const addToCart = useStore((state) => state.addToCart);
  const currentUser = useStore((state) => state.currentUser);
  const cart = useStore((state) => state.cart);

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

    if (product.stockAmount <= 0) {
      toast.error('This product is out of stock');
      return;
    }

    const currentCartItem = cart.find(item => item.productId === product.id);
    const currentQuantity = currentCartItem?.quantity || 0;

    if (currentQuantity + 1 > product.stockAmount) {
      toast.error(`Only ${product.stockAmount} items available in stock`);
      return;
    }
    
    setIsAddingToCart(true);
    await randomDelay(500, 1000);
    addToCart(product, 1);
    toast.success('Added to cart');
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
              <div className="relative aspect-square">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full rounded-lg"
                />
                {product.stockAmount <= 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <Badge variant="destructive" className="text-base">
                      Out of Stock
                    </Badge>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                  <p className="text-2xl font-semibold text-primary">
                    ৳{product.price.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Description</h2>
                  <p className="text-gray-600">{product.description}</p>
                </div>

                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Stock Information</h2>
                  <div className="flex items-center space-x-2">
                    <p className="text-gray-600">
                      Available: {product.stockAmount} units
                    </p>
                    {product.stockAmount <= 5 && product.stockAmount > 0 && (
                      <Badge variant="secondary">
                        Low Stock
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <Button
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.stockAmount <= 0}
                  variant={product.stockAmount <= 0 ? "secondary" : "default"}
                >
                  {isAddingToCart ? (
                    <>
                      <Skeleton className="h-4 w-4 mr-2 rounded-full animate-spin" />
                      Adding to Cart...
                    </>
                  ) : product.stockAmount <= 0 ? (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Out of Stock
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
