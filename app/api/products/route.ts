import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CreateProductInput } from '@/lib/types';

// Get all products or seller's products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');

    const products = await prisma.product.findMany({
      where: sellerId ? { sellerId } : undefined,
      include: {
        seller: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Error fetching products' },
      { status: 500 }
    );
  }
}

// Create a new product
export async function POST(request: Request) {
  try {
    const body = await request.json() as CreateProductInput;
    const { name, price, description, image, sellerId, stockAmount } = body;

    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        description,
        image,
        sellerId,
        ...(stockAmount !== undefined ? { stockAmount: Number(stockAmount) } : {})
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Error creating product' },
      { status: 500 }
    );
  }
}
