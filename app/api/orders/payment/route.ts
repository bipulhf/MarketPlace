import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId, status } = await request.json();

    if (!userId) {
      return new NextResponse('User ID is required', { status: 400 });
    }

    // Update all pending orders for the user to paid
    const updatedOrders = await prisma.order.updateMany({
      where: {
        buyerId: userId,
        status: 'pending'
      },
      data: {
        status
      }
    });

    return NextResponse.json({ 
      message: 'Orders updated successfully',
      updatedCount: updatedOrders.count 
    });
  } catch (error) {
    console.error('Error updating orders:', error);
    return new NextResponse('Error updating orders', { status: 500 });
  }
}
