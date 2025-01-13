import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Props {
  params: Promise<{ id: string }>
}

// Get a single product
export async function GET(
  request: NextRequest,
  { params }: Props
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: 'Product ID is required' },
      { status: 400 }
    );
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Error fetching product' },
      { status: 500 }
    );
  }
}

// Update a product
export async function PATCH(
  request: NextRequest,
  { params }: Props
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: 'Product ID is required' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { name, price, description, image } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        price,
        description,
        image
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Error updating product' },
      { status: 500 }
    );
  }
}

// Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: Props
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: 'Product ID is required' },
      { status: 400 }
    );
  }

  try {
    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Error deleting product' },
      { status: 500 }
    );
  }
}
