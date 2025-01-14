'use client';

import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function BuyerDashboard() {
  const router = useRouter();
  const products = useStore(state => state.products);
  const addToCart = useStore(state => state.addToCart);
  const cart = useStore(state => state.cart);

  const handleAddToCart = (product: Product, quantity: number) => {
    if (product.stockAmount <= 0) {
      toast.error('This product is out of stock');
      return;
    }

    const currentCartItem = cart.find(item => item.productId === product.id);
    const currentQuantity = currentCartItem?.quantity || 0;

    if (currentQuantity + quantity > product.stockAmount) {
      toast.error(`Only ${product.stockAmount} items available in stock`);
      return;
    }

    addToCart(product, quantity);
    toast.success('Added to cart');
  };

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
              {product.stockAmount <= 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-sm">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>
            <div>
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-sm sm:text-base">{product.name}</h3>
                <p className="text-gray-600 text-sm sm:text-base">৳{product.price.toFixed(2)}</p>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 line-clamp-2">{product.description}</p>
              <div className="flex items-center mt-2">
                <p className="text-sm text-gray-600">
                  Stock: {product.stockAmount}
                </p>
                {product.stockAmount <= 5 && product.stockAmount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    Low Stock
                  </Badge>
                )}
              </div>
              <Button
                onClick={() => handleAddToCart(product, 1)}
                className="w-full mt-3 sm:mt-4 text-sm sm:text-base"
                disabled={product.stockAmount <= 0}
                variant={product.stockAmount <= 0 ? "secondary" : "default"}
              >
                {product.stockAmount <= 0 ? (
                  <>
                    <AlertCircle className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Out of Stock
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}