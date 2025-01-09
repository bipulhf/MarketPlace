import { NextResponse } from 'next/server';

// This is a mock database for demonstration
// Replace this with your actual database query
const mockProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 99.99,
    description: 'High-quality wireless headphones with noise cancellation.',
    category: 'Electronics'
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 199.99,
    description: 'Feature-rich smartwatch with health tracking capabilities.',
    category: 'Electronics'
  },
  {
    id: 3,
    name: 'Laptop Backpack',
    price: 49.99,
    description: 'Durable laptop backpack with multiple compartments.',
    category: 'Accessories'
  },
  // Add more mock products as needed
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';

  // Simple search implementation
  // Replace this with your actual search logic
  const results = mockProducts.filter(product => 
    product.name.toLowerCase().includes(query) ||
    product.description.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query)
  );

  // Add artificial delay to simulate network request
  await new Promise(resolve => setTimeout(resolve, 500));

  return NextResponse.json(results);
}
