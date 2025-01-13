import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

interface Props {
  params: Promise<{ id: string }>
}

// Get a single order
export async function GET(
  request: NextRequest,
  { params }: Props
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: 'Order ID is required' },
      { status: 400 }
    );
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        buyer: {
          select: {
            name: true,
            email: true
          }
        },
        seller: {
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
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Error fetching order' },
      { status: 500 }
    );
  }
}

// Update order status
export async function PATCH(
  request: NextRequest,
  { params }: Props
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: 'Order ID is required' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!Object.values(OrderStatus).includes(status)) {
      return NextResponse.json(
        { error: 'Invalid order status' },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
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
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Error updating order' },
      { status: 500 }
    );
  }
}
