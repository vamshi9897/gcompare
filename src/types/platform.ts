export interface PlatformAdapter {
  name: string;
  type: 'E_COMMERCE' | 'QUICK_COMMERCE';

  searchProducts(
    query: string,
    filters?: SearchFilters,
  ): Promise<PlatformProduct[]>;
  getProductDetails(productId: string): Promise<PlatformProduct>;
  getProductPrice(productId: string): Promise<PlatformPrice>;
  getReviews?(productId: string): Promise<PlatformReview[]>;
  generateAffiliateLink(productId: string): string;
}

export interface SearchFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'relevance';
}

export interface PlatformProduct {
  id: string;
  title: string;
  description?: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  images?: string[];
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
  brand?: string;
  category?: string;
  specifications?: Record<string, any>;
  url: string;
}

export interface PlatformPrice {
  price: number;
  originalPrice?: number;
  inStock: boolean;
  currency: string;
  lastUpdated: Date;
}

export interface PlatformReview {
  id?: string;
  author?: string;
  rating: number;
  title?: string;
  content?: string;
  verified?: boolean;
  helpfulCount?: number;
  createdAt: Date;
}
