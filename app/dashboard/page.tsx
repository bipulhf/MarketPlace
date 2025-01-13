"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import BuyerDashboard from '@/components/dashboard/BuyerDashboard';
import SellerDashboard from '@/components/dashboard/SellerDashboard';
// import DeliveryDashboard from '@/components/dashboard/DeliveryDashboard';

export default function DashboardPage() {
  const currentUser = useStore(state => state.currentUser);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {currentUser.role === 'buyer' && <BuyerDashboard />}
      {currentUser.role === 'seller' && <SellerDashboard />}
      {/* {currentUser.role === 'delivery' && <DeliveryDashboard />} */}
    </div>
  );
}