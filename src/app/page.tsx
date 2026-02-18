import Link from 'next/link';
import {
  Search,
  TrendingUp,
  Bell,
  Star,
  ShoppingCart,
  Zap,
  Shield,
  TrendingDown,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              GCompare
            </span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="/search" className="text-gray-600 hover:text-gray-900">
              Search
            </Link>
            <Link href="/categories" className="text-gray-600 hover:text-gray-900">
              Categories
            </Link>
            <Link href="/account" className="text-gray-600 hover:text-gray-900">
              Account
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900">
              <Bell className="h-5 w-5" />
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Compare Prices Across
            <br />
            Multiple Platforms
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Find the best deals from Amazon, Flipkart, Zepto, Blinkit, and more.
            Save money on every purchase with real-time price comparisons.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-full shadow-lg border-2 border-gray-100 focus-within:border-blue-500 transition">
              <Search className="h-6 w-6 text-gray-400 ml-6" />
              <input
                type="text"
                placeholder="Search for products..."
                className="flex-1 px-6 py-4 text-lg rounded-full outline-none"
              />
              <button className="mr-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-medium">
                Search
              </button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="text-sm text-gray-500">Popular:</span>
            {['iPhone 15', 'AirPods Pro', 'PS5', 'MacBook', 'Samsung TV'].map(
              (term) => (
                <button
                  key={term}
                  className="px-4 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition"
                >
                  {term}
                </button>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose GCompare?
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8 text-blue-600" />}
            title="Real-Time Prices"
            description="Get live price updates from all major platforms"
          />
          <FeatureCard
            icon={<Bell className="h-8 w-8 text-purple-600" />}
            title="Price Alerts"
            description="Get notified when prices drop to your target"
          />
          <FeatureCard
            icon={<Star className="h-8 w-8 text-yellow-600" />}
            title="Aggregated Reviews"
            description="See reviews from all platforms in one place"
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-green-600" />}
            title="Trusted Platforms"
            description="Compare prices from verified sellers only"
          />
        </div>
      </section>

      {/* Platforms Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            We Compare Across
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              'Amazon',
              'Flipkart',
              'Zepto',
              'Blinkit',
              'Swiggy Instamart',
              'BigBasket',
              'Meesho',
              'Myntra',
            ].map((platform) => (
              <div
                key={platform}
                className="flex items-center justify-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition"
              >
                <span className="text-lg font-semibold text-gray-700">
                  {platform}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Deals Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Trending Deals</h2>
          <Link
            href="/deals"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <DealCard key={i} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Never Overpay Again
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of smart shoppers saving money every day
          </p>
          <button className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:shadow-lg transition">
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ShoppingCart className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold text-white">GCompare</span>
              </div>
              <p className="text-sm">
                Your trusted platform for comparing prices across multiple
                e-commerce sites.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/features" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-white">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            © 2026 GCompare. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center p-6 rounded-lg hover:shadow-lg transition">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function DealCard() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-4">
        <h3 className="font-semibold mb-2">Sample Product Name</h3>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">₹2,999</span>
            <span className="text-sm text-gray-500 line-through">₹4,999</span>
          </div>
          <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-sm font-medium flex items-center">
            <TrendingDown className="h-4 w-4 mr-1" />
            40% OFF
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
          <span>4.5 (234 reviews)</span>
        </div>
        <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Compare Prices
        </button>
      </div>
    </div>
  );
}
