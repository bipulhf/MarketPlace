'use client';

import { useStore } from '@/lib/store';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function CartIcon() {
  const cart = useStore(state => state.cart);
  const currentUser = useStore(state => state.currentUser);
  const router = useRouter();

  if (!currentUser || currentUser.role !== 'buyer') {
    return null;
  }

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Button
      variant="ghost"
      className="relative"
      onClick={() => router.push('/cart')}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Button>
  );
}
