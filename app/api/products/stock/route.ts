import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UpdateStockInput } from '@/lib/types';

export async function PATCH(request: Request) {
  try {
    const body = await request.json() as UpdateStockInput;
    const { productId, stockAmount } = body;

    if (typeof stockAmount !== 'number' || stockAmount < 0) {
      return NextResponse.json(
        { error: 'Stock amount must be a non-negative number' },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: { stockAmount: stockAmount }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json(
      { error: 'Error updating stock' },
      { status: 500 }
    );
  }
}
