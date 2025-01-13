'use client';

import { useEffect, useState } from 'react';
import { DataFetcher } from './DataFetcher';

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

  return (
    <>
      <DataFetcher />
      {children}
    </>
  );
}
