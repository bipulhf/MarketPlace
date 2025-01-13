import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Get buyer's orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const buyerId = searchParams.get('buyerId');

    if (!buyerId) {
      return NextResponse.json(
        { error: 'Buyer ID is required' },
        { status: 400 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { buyerId },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              include: {
                seller: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching buyer orders:', error);
    return NextResponse.json(
      { error: 'Error fetching orders' },
      { status: 500 }
    );
  }
}

// Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { buyerId, items } = body;

    if (!buyerId || !items?.length) {
      return NextResponse.json(
        { error: 'Buyer ID and items are required' },
        { status: 400 }
      );
    }

    // Get product details to calculate total and verify seller
    const firstItem = items[0];
    const product = await prisma.product.findUnique({
      where: { id: firstItem.productId },
      include: {
        seller: true
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Calculate total from current product prices
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: items.map(item => item.productId)
        }
      },
      include: {
        seller: true
      }
    });

    const total = items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        buyerId,
        sellerId: product.seller.id,
        total,
        items: {
          create: items.map(item => ({
            quantity: item.quantity,
            product: {
              connect: { id: item.productId }
            }
          }))
        }
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: {
              include: {
                seller: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
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
