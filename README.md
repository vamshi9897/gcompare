# GCompare - Product Comparison Platform

A comprehensive product comparison platform that aggregates and compares prices across multiple e-commerce and quick-commerce platforms. Built with Next.js 14+, TypeScript, Prisma, PostgreSQL, and Redis.

## Features

- 🔍 **Multi-Platform Price Comparison** - Compare prices across Amazon, Flipkart, Zepto, Blinkit, Swiggy Instamart, BigBasket, and more
- 📊 **Price History Tracking** - Visual charts showing price trends over time
- 🔔 **Price Alerts** - Get notified when products reach your target price
- ⭐ **Aggregated Reviews** - See reviews from all platforms in one place
- 💰 **Affiliate Monetization** - Built-in affiliate link tracking and commission management
- 📱 **Responsive Design** - Beautiful, modern UI with Tailwind CSS and shadcn/ui
- ⚡ **Fast Performance** - Redis caching and optimized database queries
- 🔐 **User Accounts** - Save favorites, set alerts, and track search history

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **Cache:** Redis
- **ORM:** Prisma
- **UI:** Tailwind CSS + shadcn/ui
- **Icons:** Lucide React
- **Charts:** Recharts
- **Authentication:** JWT + bcryptjs

## Prerequisites

- Node.js 18+ or Bun
- Docker and Docker Compose (for local development)
- PostgreSQL 16+ (or use Docker)
- Redis 7+ (or use Docker)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/vamshi9897/gcompare.git
cd gcompare
```

### 2. Install dependencies

```bash
npm install
# or
bun install
```

### 3. Start database services

```bash
docker-compose up -d
```

This will start PostgreSQL and Redis containers.

### 4. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and configure your database and API keys.

### 5. Run database migrations

```bash
npx prisma generate
npx prisma db push
```

### 6. Seed the database (optional)

```bash
npx prisma db seed
```

### 7. Start the development server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── api/              # API routes
│   │   ├── search/           # Search results page
│   │   ├── product/          # Product detail pages
│   │   └── account/          # User account pages
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   └── ...              # Custom components
│   ├── lib/                  # Utility libraries
│   │   ├── platforms/       # Platform integrations
│   │   ├── services/        # Business logic services
│   │   ├── db.ts           # Prisma client
│   │   ├── redis.ts        # Redis client
│   │   └── utils.ts        # Helper functions
│   └── types/               # TypeScript type definitions
├── docker-compose.yml        # Docker services
├── package.json
└── tsconfig.json
```

## Platform Integrations

The platform supports multiple e-commerce and quick-commerce platforms:

### E-Commerce
- Amazon (Product Advertising API + scraping fallback)
- Flipkart (Affiliate API)
- Meesho (Web scraping)
- Myntra (Web scraping)

### Quick Commerce
- Zepto (Web scraping)
- Blinkit (Web scraping)
- Swiggy Instamart (Web scraping)
- BigBasket (API/scraping)

### Adding New Platforms

1. Create a new adapter in `src/lib/platforms/your-platform.ts`
2. Extend `BasePlatformAdapter`
3. Implement required methods: `searchProducts`, `getProductDetails`, `getProductPrice`
4. Register the platform in the database
5. Add API keys to `.env`

## API Routes

- `GET /api/search` - Search products across platforms
- `GET /api/products/[id]` - Get product details
- `GET /api/products/[id]/prices` - Get price comparison
- `GET /api/products/[id]/history` - Get price history
- `GET /api/products/[id]/reviews` - Get aggregated reviews
- `GET /api/categories` - Get category tree
- `GET /api/platforms` - Get available platforms
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/user/alerts` - Get user price alerts
- `POST /api/user/alerts` - Create price alert
- `GET /api/user/favorites` - Get user favorites
- `POST /api/user/click` - Track affiliate click

## Monetization

The platform includes built-in monetization features:

1. **Affiliate Links** - All product links are tracked with affiliate IDs
2. **Click Tracking** - Monitor clicks and conversion rates
3. **Advertisement System** - Display banners and promoted products
4. **Premium Subscriptions** - Offer premium features (unlimited alerts, ad-free, etc.)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables
4. Deploy

### Docker

```bash
docker build -t gcompare .
docker run -p 3000:3000 gcompare
```

### Manual

```bash
npm run build
npm start
```

## Environment Variables

See `.env.example` for all required environment variables.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret for JWT tokens
- Platform API keys (Amazon, Flipkart, etc.)
- SMTP credentials for email notifications

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@gcompare.com or open an issue on GitHub.

## Roadmap

- [ ] Mobile app (React Native)
- [ ] AI-powered price predictions
- [ ] Browser extension for instant price comparison
- [ ] WhatsApp bot for price alerts
- [ ] International platform support
- [ ] Product recommendations engine
- [ ] Social features (share deals, community reviews)

---

**Built with ❤️ for savvy shoppers**
