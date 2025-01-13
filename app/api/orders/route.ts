import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Get all orders or seller's orders
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');
    const buyerId = searchParams.get('buyerId');

    const orders = await prisma.order.findMany({
      where: {
        ...(sellerId && { sellerId }),
        ...(buyerId && { buyerId })
      },
      include: {
        buyer: {
          select: {
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Error fetching orders' },
      { status: 500 }
    );
  }
}

// Create a new order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { buyerId, sellerId, items, total } = body;

    const order = await prisma.order.create({
      data: {
        buyerId,
        sellerId,
        total,
        items: {
          create: items.map((item: { productId: string; quantity: number }) => ({
            quantity: item.quantity,
            product: {
              connect: { id: item.productId }
            }
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Error creating order' },
      { status: 500 }
    );
  }
}
