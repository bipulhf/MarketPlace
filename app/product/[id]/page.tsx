'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { Product, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const products = useStore((state) => state.products);
  const users = useStore((state) => state.users);
  const addToCart = useStore((state) => state.addToCart);
  const currentUser = useStore((state) => state.currentUser);

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === params.id);
    if (foundProduct) {
      setProduct(foundProduct);
      const productSeller = users.find((u) => u.id === foundProduct.sellerId);
      setSeller(productSeller || null);
    }
  }, [params.id, products, users]);

  const handleAddToCart = () => {
    if (!currentUser) {
      toast.error('Please login to add items to cart');
      router.push('/login');
      return;
    }
    
    if (product) {
      addToCart(product.id);
      toast.success('Added to cart successfully');
    }
  };

  if (!product) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Product not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image available
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold text-primary">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-2">Seller Information</h2>
            {seller ? (
              <p className="text-muted-foreground">Sold by {seller.name}</p>
            ) : (
              <p className="text-muted-foreground">Seller information not available</p>
            )}
          </div>

          <div className="pt-4">
            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
