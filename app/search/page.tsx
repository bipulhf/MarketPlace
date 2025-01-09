'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchInput } from '@/components/search-input';
import { SearchResults } from '@/components/search-results';
import { useStore } from '@/lib/store';
import { Product } from '@/lib/types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const products = useStore((state) => state.products);
  
  const searchResults = useMemo(() => {
    if (!searchQuery) return [];
    
    const query = searchQuery.toLowerCase();
    return products.filter((product: Product) => 
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  }, [searchQuery, products]);

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Search Products</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchInput />
          </CardContent>
        </Card>

        {searchQuery && searchResults.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
            </CardContent>
          </Card>
        )}

        {searchResults.length > 0 && (
          <SearchResults results={searchResults} />
        )}
      </div>
    </div>
  );
}
