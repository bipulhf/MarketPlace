'use client';

import { useStore } from '@/lib/store';
import { useEffect, useState } from 'react';

export function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait till Zustand store is hydrated
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}
