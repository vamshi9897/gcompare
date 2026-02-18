import { PrismaClient, PlatformType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create platforms
  const platforms = await Promise.all([
    prisma.platform.upsert({
      where: { name: 'amazon' },
      update: {},
      create: {
        name: 'amazon',
        displayName: 'Amazon',
        type: PlatformType.E_COMMERCE,
        baseUrl: 'https://www.amazon.in',
        apiUrl: 'https://api.amazon.in',
        affiliateId: process.env.AMAZON_ASSOCIATE_ID || '',
        isActive: true,
      },
    }),
    prisma.platform.upsert({
      where: { name: 'flipkart' },
      update: {},
      create: {
        name: 'flipkart',
        displayName: 'Flipkart',
        type: PlatformType.E_COMMERCE,
        baseUrl: 'https://www.flipkart.com',
        apiUrl: 'https://api.flipkart.com',
        affiliateId: process.env.FLIPKART_AFFILIATE_ID || '',
        isActive: true,
      },
    }),
    prisma.platform.upsert({
      where: { name: 'zepto' },
      update: {},
      create: {
        name: 'zepto',
        displayName: 'Zepto',
        type: PlatformType.QUICK_COMMERCE,
        baseUrl: 'https://www.zeptonow.com',
        isActive: true,
      },
    }),
    prisma.platform.upsert({
      where: { name: 'blinkit' },
      update: {},
      create: {
        name: 'blinkit',
        displayName: 'Blinkit',
        type: PlatformType.QUICK_COMMERCE,
        baseUrl: 'https://www.blinkit.com',
        isActive: true,
      },
    }),
    prisma.platform.upsert({
      where: { name: 'swiggy-instamart' },
      update: {},
      create: {
        name: 'swiggy-instamart',
        displayName: 'Swiggy Instamart',
        type: PlatformType.QUICK_COMMERCE,
        baseUrl: 'https://www.swiggy.com/instamart',
        isActive: true,
      },
    }),
    prisma.platform.upsert({
      where: { name: 'bigbasket' },
      update: {},
      create: {
        name: 'bigbasket',
        displayName: 'BigBasket',
        type: PlatformType.QUICK_COMMERCE,
        baseUrl: 'https://www.bigbasket.com',
        isActive: true,
      },
    }),
  ]);

  console.log(`Created ${platforms.length} platforms`);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electronics',
        slug: 'electronics',
        icon: '📱',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'fashion' },
      update: {},
      create: {
        name: 'Fashion',
        slug: 'fashion',
        icon: '👕',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'groceries' },
      update: {},
      create: {
        name: 'Groceries',
        slug: 'groceries',
        icon: '🛒',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'home-kitchen' },
      update: {},
      create: {
        name: 'Home & Kitchen',
        slug: 'home-kitchen',
        icon: '🏠',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'beauty' },
      update: {},
      create: {
        name: 'Beauty & Personal Care',
        slug: 'beauty',
        icon: '💄',
      },
    }),
  ]);

  console.log(`Created ${categories.length} categories`);

  // Create sample products
  const electronics = categories.find((c) => c.slug === 'electronics');
  if (electronics) {
    const sampleProduct = await prisma.product.upsert({
      where: { id: 'sample-product-1' },
      update: {},
      create: {
        id: 'sample-product-1',
        title: 'Apple iPhone 15 (128GB) - Black',
        description:
          'The iPhone 15 features a beautiful design, powerful A16 Bionic chip, and an advanced dual-camera system.',
        brand: 'Apple',
        categoryId: electronics.id,
        imageUrl: '/placeholder-product.jpg',
        rating: 4.5,
        reviewCount: 1234,
        promoted: true,
      },
    });

    // Add prices for the sample product
    const amazonPlatform = platforms.find((p) => p.name === 'amazon');
    const flipkartPlatform = platforms.find((p) => p.name === 'flipkart');

    if (amazonPlatform) {
      await prisma.productPrice.upsert({
        where: { platformId_externalId: { platformId: amazonPlatform.id, externalId: 'B0CHP2F5YP' } },
        update: {},
        create: {
          productId: sampleProduct.id,
          platformId: amazonPlatform.id,
          externalId: 'B0CHP2F5YP',
          price: 79900,
          originalPrice: 89900,
          inStock: true,
          currency: 'INR',
          affiliateUrl: 'https://www.amazon.in/dp/B0CHP2F5YP?tag=gcompare-21',
        },
      });
    }

    if (flipkartPlatform) {
      await prisma.productPrice.upsert({
        where: { platformId_externalId: { platformId: flipkartPlatform.id, externalId: 'MOBGTAGPAQFZMRQQ' } },
        update: {},
        create: {
          productId: sampleProduct.id,
          platformId: flipkartPlatform.id,
          externalId: 'MOBGTAGPAQFZMRQQ',
          price: 78999,
          originalPrice: 89900,
          inStock: true,
          currency: 'INR',
          affiliateUrl: 'https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm...',
        },
      });
    }

    console.log('Created sample product with prices');
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
