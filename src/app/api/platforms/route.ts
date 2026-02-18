import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCached, setCached } from '@/lib/redis';

export async function GET() {
  try {
    // Check cache first
    const cacheKey = 'platforms:active';
    const cached = await getCached<any>(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Fetch active platforms from database
    const platforms = await prisma.platform.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        displayName: true,
        type: true,
        logoUrl: true,
      },
      orderBy: { name: 'asc' },
    });

    // Cache for 1 hour
    await setCached(cacheKey, platforms, 3600);

    return NextResponse.json(platforms);
  } catch (error) {
    console.error('Platforms fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
