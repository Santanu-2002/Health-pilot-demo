const buckets = new Map();

// Lightweight single-instance protection. Use a shared store (for example Redis)
// if deploying multiple API instances.
export function rateLimit({ windowMs = 60_000, max = 30, keyPrefix = 'general' } = {}) {
  return (req, res, next) => {
    const key = `${keyPrefix}:${req.ip || req.socket.remoteAddress || 'unknown'}`;
    const now = Date.now();
    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) bucket = { count: 0, resetAt: now + windowMs };
    bucket.count += 1;
    buckets.set(key, bucket);
    if (buckets.size > 5000) for (const [entryKey, value] of buckets) if (value.resetAt <= now) buckets.delete(entryKey);
    res.setHeader('RateLimit-Limit', max);
    res.setHeader('RateLimit-Remaining', Math.max(0, max - bucket.count));
    if (bucket.count > max) return res.status(429).json({ message: 'Too many requests. Please wait a moment and try again.' });
    next();
  };
}
