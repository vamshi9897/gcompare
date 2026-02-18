import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis =
  globalForRedis.redis ??
  new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

// Helper functions for common cache operations
export async function getCached<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key);
  if (!cached) return null;
  try {
    return JSON.parse(cached) as T;
  } catch {
    return null;
  }
}

export async function setCached<T>(
  key: string,
  value: T,
  ttlSeconds: number = 300,
): Promise<void> {
  await redis.setex(key, ttlSeconds, JSON.stringify(value));
}

export async function deleteCached(key: string): Promise<void> {
  await redis.del(key);
}

export async function invalidatePattern(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
