import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CartItem, CreateOrderInput } from '@/lib/types';

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
    const body = await request.json() as CreateOrderInput;
    const { buyerId, sellerId, items, total } = body;

    // Check stock availability for all items
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 404 }
        );
      }

      if (product.stockAmount < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for product: ${product.name}` },
          { status: 400 }
        );
      }
    }

    // Create order and update stock amounts in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          buyerId,
          sellerId,
          total: Number(total),
          items: {
            create: items.map((item: CartItem) => ({
              quantity: Number(item.quantity),
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

      // Update stock amounts
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockAmount: {
              decrement: Number(item.quantity)
            }
          }
        });
      }

      return newOrder;
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
