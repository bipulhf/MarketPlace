import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, status } = body;

    if (!userId || !status) {
      return new NextResponse(JSON.stringify({
        success: false,
        error: 'User ID and status are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
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

    return new NextResponse(JSON.stringify({
      success: true,
      message: 'Orders updated successfully',
      updatedCount: updatedOrders.count
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({
      success: false,
      error: 'Error updating orders'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
