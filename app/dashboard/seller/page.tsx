'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Package, DollarSign, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Analytics {
  currentMonth: {
    total: number;
    orderCount: number;
  };
  lifetime: {
    total: number;
    orderCount: number;
  };
}

export default function SellerDashboard() {
  const { currentUser, products } = useStore();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'seller') {
      router.push('/login');
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/seller/analytics?sellerId=${currentUser.id}`);
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [currentUser, router]);

  if (!currentUser || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <Link href="/dashboard/seller/add-product">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Products */}
          <Card className="p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <h3 className="text-2xl font-bold">{products.length}</h3>
              </div>
            </div>
          </Card>

          {/* Current Month Sales */}
          <Card className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Current Month Sales</p>
                <h3 className="text-2xl font-bold">
                  ৳{analytics?.currentMonth.total.toFixed(2) || '0.00'}
                </h3>
                <p className="text-sm text-gray-500">
                  {analytics?.currentMonth.orderCount || 0} orders
                </p>
              </div>
            </div>
          </Card>

          {/* Lifetime Sales */}
          <Card className="p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Lifetime Sales</p>
                <h3 className="text-2xl font-bold">
                  ৳{analytics?.lifetime.total.toFixed(2) || '0.00'}
                </h3>
                <p className="text-sm text-gray-500">
                  {analytics?.lifetime.orderCount || 0} orders
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Products List */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Your Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <p className="font-bold">৳{product.price.toFixed(2)}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
