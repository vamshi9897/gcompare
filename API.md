# GCompare API Documentation

Base URL: `https://yourdomain.com/api`

All responses are in JSON format.

## Authentication

Some endpoints require authentication. Include JWT token in Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### 1. Search Products

Search for products across multiple platforms.

**Endpoint:** `GET /api/search`

**Query Parameters:**
- `q` (required): Search query
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20, max: 100)
- `sortBy` (optional): Sort order (`price_asc`, `price_desc`, `rating`, `relevance`)
- `category` (optional): Filter by category slug
- `brand` (optional): Filter by brand name
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `inStock` (optional): Filter by availability (true/false)

**Example Request:**
```bash
GET /api/search?q=iphone+15&sortBy=price_asc&minPrice=50000&maxPrice=100000
```

**Response:**
```json
{
  "query": "iphone 15",
  "page": 1,
  "limit": 20,
  "total": 42,
  "results": [
    {
      "id": "prod_123",
      "title": "Apple iPhone 15 (128GB) - Black",
      "description": "...",
      "imageUrl": "https://...",
      "prices": [
        {
          "platform": "Amazon",
          "price": 79900,
          "originalPrice": 89900,
          "inStock": true,
          "url": "https://..."
        },
        {
          "platform": "Flipkart",
          "price": 78999,
          "originalPrice": 89900,
          "inStock": true,
          "url": "https://..."
        }
      ],
      "lowestPrice": 78999,
      "rating": 4.5,
      "reviewCount": 1234
    }
  ]
}
```

### 2. Get Product Details

Get detailed information about a specific product.

**Endpoint:** `GET /api/products/[id]`

**Example Request:**
```bash
GET /api/products/prod_123
```

**Response:**
```json
{
  "id": "prod_123",
  "title": "Apple iPhone 15 (128GB) - Black",
  "description": "...",
  "brand": "Apple",
  "category": {
    "id": "cat_123",
    "name": "Electronics",
    "slug": "electronics"
  },
  "imageUrl": "https://...",
  "images": ["https://...", "https://..."],
  "specifications": {
    "storage": "128GB",
    "color": "Black",
    "ram": "6GB"
  },
  "rating": 4.5,
  "reviewCount": 1234,
  "prices": [...],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### 3. Get Price Comparison

Get current prices across all platforms for a product.

**Endpoint:** `GET /api/products/[id]/prices`

**Example Request:**
```bash
GET /api/products/prod_123/prices
```

**Response:**
```json
{
  "productId": "prod_123",
  "prices": [
    {
      "platform": {
        "id": "plat_123",
        "name": "amazon",
        "displayName": "Amazon"
      },
      "price": 79900,
      "originalPrice": 89900,
      "discount": 11,
      "inStock": true,
      "currency": "INR",
      "affiliateUrl": "https://...",
      "isLowest": false,
      "lastUpdated": "2024-01-15T10:30:00Z"
    },
    {
      "platform": {
        "id": "plat_124",
        "name": "flipkart",
        "displayName": "Flipkart"
      },
      "price": 78999,
      "originalPrice": 89900,
      "discount": 12,
      "inStock": true,
      "currency": "INR",
      "affiliateUrl": "https://...",
      "isLowest": true,
      "lastUpdated": "2024-01-15T10:25:00Z"
    }
  ],
  "lowestPrice": 78999,
  "highestPrice": 79900,
  "averagePrice": 79449.5
}
```

### 4. Get Price History

Get historical price data for a product.

**Endpoint:** `GET /api/products/[id]/history`

**Query Parameters:**
- `days` (optional): Number of days of history (default: 30, max: 365)
- `platformId` (optional): Filter by specific platform

**Example Request:**
```bash
GET /api/products/prod_123/history?days=90
```

**Response:**
```json
{
  "productId": "prod_123",
  "days": 90,
  "history": [
    {
      "date": "2024-01-01",
      "prices": {
        "amazon": 89900,
        "flipkart": 88999
      }
    },
    {
      "date": "2024-01-02",
      "prices": {
        "amazon": 87900,
        "flipkart": 87999
      }
    }
  ]
}
```

### 5. Get Product Reviews

Get aggregated reviews from all platforms.

**Endpoint:** `GET /api/products/[id]/reviews`

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Reviews per page
- `sortBy` (optional): Sort by (`recent`, `helpful`, `rating`)

**Example Request:**
```bash
GET /api/products/prod_123/reviews?sortBy=helpful&limit=10
```

**Response:**
```json
{
  "productId": "prod_123",
  "page": 1,
  "limit": 10,
  "total": 234,
  "averageRating": 4.5,
  "reviews": [
    {
      "id": "rev_123",
      "platform": "Amazon",
      "author": "Customer",
      "rating": 5,
      "title": "Great product!",
      "content": "...",
      "verified": true,
      "helpfulCount": 42,
      "createdAt": "2024-01-10T12:00:00Z"
    }
  ]
}
```

### 6. Get Categories

Get category tree.

**Endpoint:** `GET /api/categories`

**Response:**
```json
{
  "categories": [
    {
      "id": "cat_123",
      "name": "Electronics",
      "slug": "electronics",
      "icon": "📱",
      "productCount": 1234,
      "children": [
        {
          "id": "cat_124",
          "name": "Smartphones",
          "slug": "smartphones",
          "productCount": 456
        }
      ]
    }
  ]
}
```

### 7. Get Platforms

Get list of all available platforms.

**Endpoint:** `GET /api/platforms`

**Response:**
```json
{
  "platforms": [
    {
      "id": "plat_123",
      "name": "amazon",
      "displayName": "Amazon",
      "type": "E_COMMERCE",
      "logoUrl": "https://..."
    },
    {
      "id": "plat_124",
      "name": "zepto",
      "displayName": "Zepto",
      "type": "QUICK_COMMERCE",
      "logoUrl": "https://..."
    }
  ]
}
```

## Authentication Endpoints

### 8. User Registration

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token_here"
}
```

### 9. User Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token_here"
}
```

## User Endpoints (Authenticated)

### 10. Get Price Alerts

**Endpoint:** `GET /api/user/alerts`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "alerts": [
    {
      "id": "alert_123",
      "product": {
        "id": "prod_123",
        "title": "iPhone 15",
        "imageUrl": "..."
      },
      "targetPrice": 70000,
      "currentPrice": 78999,
      "isActive": true,
      "triggered": false,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 11. Create Price Alert

**Endpoint:** `POST /api/user/alerts`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productId": "prod_123",
  "targetPrice": 70000
}
```

**Response:**
```json
{
  "success": true,
  "alert": {
    "id": "alert_123",
    "productId": "prod_123",
    "targetPrice": 70000,
    "isActive": true
  }
}
```

### 12. Delete Price Alert

**Endpoint:** `DELETE /api/user/alerts/[id]`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Alert deleted"
}
```

### 13. Get Favorites

**Endpoint:** `GET /api/user/favorites`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "favorites": [
    {
      "id": "fav_123",
      "product": {
        "id": "prod_123",
        "title": "iPhone 15",
        "imageUrl": "...",
        "lowestPrice": 78999
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 14. Add to Favorites

**Endpoint:** `POST /api/user/favorites`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "productId": "prod_123"
}
```

**Response:**
```json
{
  "success": true,
  "favorite": {
    "id": "fav_123",
    "productId": "prod_123"
  }
}
```

### 15. Track Affiliate Click

**Endpoint:** `POST /api/user/click`

**Request Body:**
```json
{
  "productId": "prod_123",
  "platformId": "plat_123"
}
```

**Response:**
```json
{
  "success": true,
  "clickId": "click_123",
  "affiliateUrl": "https://..."
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

- **Anonymous**: 100 requests per hour
- **Authenticated**: 1000 requests per hour
- **Premium**: 10000 requests per hour

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642345678
```

## Webhooks (Future Feature)

Subscribe to product price changes:

```json
{
  "event": "price.changed",
  "productId": "prod_123",
  "platform": "amazon",
  "oldPrice": 79900,
  "newPrice": 78999,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

For API support, email api@gcompare.com
