'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Product, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<User | null>(null);
  const { fetchProductDetails, addToCart, currentUser } = useStore();

  useEffect(() => {
    const loadProduct = async () => {
      if (params?.id) {
        const data = await fetchProductDetails(params.id as string);
        if (data) {
          setProduct(data);
          // Fetch seller information
          try {
            const response = await fetch(`/api/users/${data.sellerId}`);
            if (response.ok) {
              const sellerData = await response.json();
              setSeller(sellerData);
            }
          } catch (error) {
            console.error('Error fetching seller:', error);
          }
        }
      }
    };
    loadProduct();
  }, [params?.id, fetchProductDetails]);

  if (!product) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-square relative mb-4 h-[400px]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Price</h3>
              <p className="text-2xl font-bold">৳{product.price.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
            <div>
              <h3 className="font-semibold">Seller</h3>
              <p className="text-gray-600">{seller?.name || 'Loading seller information...'}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => addToCart(product, 1)}
            disabled={!currentUser || currentUser.id === product.sellerId}
            className="w-full"
          >
            {!currentUser
              ? 'Login to Buy'
              : currentUser.id === product.sellerId
              ? 'Cannot Buy Own Product'
              : 'Add to Cart'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
