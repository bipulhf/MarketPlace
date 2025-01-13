'use client';

import { useStore } from '@/lib/store';
import { useEffect } from 'react';

export function DataFetcher() {
  const { fetchProducts, currentUser, fetchBuyerOrders, fetchSellerOrders } = useStore();

  useEffect(() => {
    // Initial data fetch
    const fetchData = async () => {
      await fetchProducts();
      if (currentUser?.role === 'buyer') {
        await fetchBuyerOrders();
      } else if (currentUser?.role === 'seller') {
        await fetchSellerOrders();
      }
    };
    fetchData();
  }, [currentUser]); // Only re-run when currentUser changes

  return null;
}
