import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { startOfMonth, endOfMonth } from 'date-fns';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');

    if (!sellerId) {
      return NextResponse.json({ error: 'Seller ID is required' }, { status: 400 });
    }

    // Get current month's start and end dates
    const currentMonthStart = startOfMonth(new Date());
    const currentMonthEnd = endOfMonth(new Date());

    // Get all orders for the seller with products included
    const orders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            product: {
              sellerId: sellerId
            }
          }
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                price: true,
                sellerId: true
              }
            }
          }
        }
      }
    });

    // Calculate totals only for seller's products
    const calculateOrderTotal = (order: any) => {
      return order.items.reduce((total: number, item: any) => {
        if (item.product && item.product.sellerId === sellerId) {
          return total + ((item.product.price || 0) * item.quantity);
        }
        return total;
      }, 0);
    };

    // Filter current month's orders
    const currentMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= currentMonthStart && orderDate <= currentMonthEnd;
    });

    const currentMonthTotal = currentMonthOrders.reduce((total, order) => {
      return total + calculateOrderTotal(order);
    }, 0);

    const lifetimeTotal = orders.reduce((total, order) => {
      return total + calculateOrderTotal(order);
    }, 0);

    return NextResponse.json({
      currentMonth: {
        total: currentMonthTotal,
        orderCount: currentMonthOrders.length
      },
      lifetime: {
        total: lifetimeTotal,
        orderCount: orders.length
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
