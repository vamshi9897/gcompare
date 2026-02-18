import { NextRequest, NextResponse } from 'next/server';
import { getCached, setCached } from '@/lib/redis';
import { AmazonAdapter } from '@/lib/platforms/amazon';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'relevance';

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 },
      );
    }

    // Check cache first
    const cacheKey = `search:${query}:${page}:${limit}:${sortBy}`;
    const cached = await getCached<any>(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, cached: true });
    }

    // For MVP, we'll use the Amazon adapter as an example
    // In production, you would aggregate from all platforms
    const amazon = new AmazonAdapter();
    const results = await amazon.searchProducts(query, {
      page,
      limit,
      sortBy: sortBy as any,
    });

    // Transform results for response
    const response = {
      query,
      page,
      limit,
      total: results.length,
      results: results.map((product) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        imageUrl: product.imageUrl,
        prices: [
          {
            platform: 'Amazon',
            price: product.price,
            originalPrice: product.originalPrice,
            inStock: product.inStock,
            url: product.url,
          },
        ],
        lowestPrice: product.price,
        rating: product.rating,
        reviewCount: product.reviewCount,
      })),
    };

    // Cache for 5 minutes
    await setCached(cacheKey, response, 300);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
