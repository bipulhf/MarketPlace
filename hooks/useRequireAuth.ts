'use client';

import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useRequireAuth(role?: string) {
  const currentUser = useStore(state => state.currentUser);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay to ensure store is hydrated
    const timer = setTimeout(() => {
      if (!currentUser) {
        router.push('/login');
      } else if (role && currentUser.role !== role) {
        router.push('/dashboard');
      }
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [currentUser, router, role]);

  return { isLoading, user: currentUser };
}
