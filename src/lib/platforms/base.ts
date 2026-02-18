import type {
  PlatformAdapter,
  PlatformProduct,
  PlatformPrice,
  PlatformReview,
  SearchFilters,
} from '@/types/platform';

export abstract class BasePlatformAdapter implements PlatformAdapter {
  abstract name: string;
  abstract type: 'E_COMMERCE' | 'QUICK_COMMERCE';
  protected abstract baseUrl: string;
  protected abstract affiliateId?: string;

  abstract searchProducts(
    query: string,
    filters?: SearchFilters,
  ): Promise<PlatformProduct[]>;

  abstract getProductDetails(productId: string): Promise<PlatformProduct>;

  abstract getProductPrice(productId: string): Promise<PlatformPrice>;

  async getReviews(productId: string): Promise<PlatformReview[]> {
    // Optional: Default implementation returns empty array
    return [];
  }

  generateAffiliateLink(productId: string): string {
    const url = new URL(`${this.baseUrl}/product/${productId}`);
    if (this.affiliateId) {
      url.searchParams.set('tag', this.affiliateId);
      url.searchParams.set('utm_source', 'gcompare');
      url.searchParams.set('utm_medium', 'affiliate');
    }
    return url.toString();
  }

  protected async fetchWithRetry(
    url: string,
    options: RequestInit = {},
    retries: number = 3,
  ): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            ...options.headers,
          },
        });

        if (response.ok) {
          return response;
        }

        if (response.status === 429) {
          // Rate limited, wait and retry
          await this.delay(1000 * (i + 1));
          continue;
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (error) {
        if (i === retries - 1) throw error;
        await this.delay(500 * (i + 1));
      }
    }
    throw new Error('Max retries reached');
  }

  protected delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
