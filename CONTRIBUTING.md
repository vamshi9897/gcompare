# Contributing to GCompare

Thank you for your interest in contributing to GCompare! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, browser, Node version)

### Suggesting Features

Feature requests are welcome! Please provide:

- **Clear use case**
- **Expected behavior**
- **Potential implementation approach**
- **Alternative solutions considered**

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write or update tests
5. Ensure all tests pass
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/gcompare.git
cd gcompare

# Install dependencies
npm install

# Start database services
docker-compose up -d

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database
npm run db:seed

# Start development server
npm run dev
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Prefer interfaces over types for object shapes
- Use strict type checking
- Avoid `any` - use `unknown` if type is truly unknown

### Code Style

We use Prettier and ESLint for code formatting:

```bash
# Format code
npx prettier --write .

# Lint code
npm run lint
```

### Naming Conventions

- **Components**: PascalCase (`ProductCard.tsx`)
- **Functions**: camelCase (`calculateDiscount`)
- **Files**: kebab-case (`price-tracker.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Interfaces**: PascalCase with `I` prefix optional (`PlatformAdapter` or `IPlatformAdapter`)

### File Structure

```
src/
├── app/                  # Next.js pages and API routes
│   ├── api/             # API endpoints
│   ├── (routes)/        # App pages
│   └── layout.tsx       # Root layout
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── features/       # Feature-specific components
├── lib/                # Utility libraries
│   ├── platforms/     # Platform integrations
│   ├── services/      # Business logic
│   └── utils.ts       # Helper functions
└── types/             # TypeScript types
```

### Component Guidelines

- Keep components small and focused
- Extract reusable logic into custom hooks
- Use composition over inheritance
- Props should be typed with interfaces

Example:

```typescript
interface ProductCardProps {
  product: Product;
  onCompare?: () => void;
  variant?: 'default' | 'compact';
}

export function ProductCard({ 
  product, 
  onCompare, 
  variant = 'default' 
}: ProductCardProps) {
  // Component logic
}
```

### API Route Guidelines

- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Validate input with Zod schemas
- Return consistent error responses
- Include proper status codes
- Add rate limiting for expensive operations

Example:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  query: z.string().min(1).max(100),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = schema.parse({
      query: searchParams.get('q'),
    });
    
    // Handle request
    return NextResponse.json({ data: [] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Adding New Platform Integrations

To add support for a new e-commerce platform:

### 1. Create Platform Adapter

Create `src/lib/platforms/your-platform.ts`:

```typescript
import { BasePlatformAdapter } from './base';
import type { PlatformProduct, PlatformPrice, SearchFilters } from '@/types/platform';

export class YourPlatformAdapter extends BasePlatformAdapter {
  name = 'your-platform';
  type = 'E_COMMERCE' as const;
  protected baseUrl = 'https://yourplatform.com';
  protected affiliateId = process.env.YOUR_PLATFORM_AFFILIATE_ID;

  async searchProducts(
    query: string,
    filters?: SearchFilters
  ): Promise<PlatformProduct[]> {
    // Implementation
  }

  async getProductDetails(productId: string): Promise<PlatformProduct> {
    // Implementation
  }

  async getProductPrice(productId: string): Promise<PlatformPrice> {
    // Implementation
  }
}
```

### 2. Add Environment Variables

Update `.env.example`:

```bash
YOUR_PLATFORM_API_KEY=""
YOUR_PLATFORM_AFFILIATE_ID=""
```

### 3. Seed Database

Add platform to `prisma/seed.ts`:

```typescript
await prisma.platform.create({
  data: {
    name: 'your-platform',
    displayName: 'Your Platform',
    type: PlatformType.E_COMMERCE,
    baseUrl: 'https://yourplatform.com',
    isActive: true,
  },
});
```

### 4. Update Documentation

- Add platform to README.md
- Document any special requirements
- Add API documentation if needed

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- product-card.test.tsx
```

### Writing Tests

- Write unit tests for utilities and services
- Write integration tests for API routes
- Write E2E tests for critical user flows

Example test:

```typescript
import { describe, it, expect } from 'vitest';
import { formatPrice } from '@/lib/utils';

describe('formatPrice', () => {
  it('formats Indian currency correctly', () => {
    expect(formatPrice(1000, 'INR')).toBe('₹1,000');
  });

  it('handles decimal places', () => {
    expect(formatPrice(1234.56, 'INR')).toBe('₹1,234.56');
  });
});
```

## Database Changes

### Creating Migrations

```bash
# Create a new migration
npx prisma migrate dev --name add_new_field

# Apply migrations to production
npx prisma migrate deploy
```

### Schema Changes

1. Update `prisma/schema.prisma`
2. Create migration
3. Update TypeScript types if needed
4. Update seed data if needed
5. Document breaking changes

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(search): add autocomplete suggestions

Implement real-time search suggestions using debounced API calls.
Includes caching to reduce server load.

Closes #123
```

```
fix(price-tracker): correct price history calculation

The price history was showing incorrect dates due to timezone
conversion issues. This fix ensures dates are stored and displayed
in UTC.

Fixes #456
```

## Documentation

- Update README.md for user-facing changes
- Update API.md for API changes
- Add JSDoc comments for complex functions
- Include inline comments for non-obvious code

## Performance Guidelines

- Minimize API calls - use caching
- Optimize images with next/image
- Use React.memo for expensive components
- Implement pagination for large lists
- Add loading states for async operations
- Use database indexes appropriately

## Security Guidelines

- Never commit API keys or secrets
- Validate all user input
- Use parameterized queries (Prisma does this)
- Implement rate limiting
- Use HTTPS in production
- Keep dependencies updated
- Follow OWASP best practices

## Getting Help

- 💬 Discussions: Use GitHub Discussions for questions
- 🐛 Issues: Report bugs via GitHub Issues
- 📧 Email: contact@gcompare.com
- 📖 Docs: Check README.md and API.md

## Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- Project website (when available)

Thank you for contributing to GCompare! 🎉
