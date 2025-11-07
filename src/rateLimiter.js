// Simple in-memory rate limiter
const requestLog = new Map();

const RATE_LIMIT_INTERVAL = parseInt(process.env.RATE_LIMIT_INTERVAL) || 30000; // 30 seconds default

/**
 * Check if a request from an IP is allowed
 * @param {string} ip - Client IP address
 * @returns {object} - { allowed: boolean, waitTime: number }
 */
export function checkRateLimit(ip) {
  const now = Date.now();
  const lastRequest = requestLog.get(ip);

  if (!lastRequest) {
    // First request from this IP
    requestLog.set(ip, now);
    return { allowed: true, waitTime: 0 };
  }

  const timeSinceLastRequest = now - lastRequest;

  if (timeSinceLastRequest < RATE_LIMIT_INTERVAL) {
    // Too soon, reject
    const waitTime = RATE_LIMIT_INTERVAL - timeSinceLastRequest;
    return { allowed: false, waitTime };
  }

  // Update last request time
  requestLog.set(ip, now);
  return { allowed: true, waitTime: 0 };
}

/**
 * Clean up old entries to prevent memory leaks
 */
export function cleanupOldEntries() {
  const now = Date.now();
  const maxAge = RATE_LIMIT_INTERVAL * 2; // Keep entries for 2x the rate limit

  for (const [ip, timestamp] of requestLog.entries()) {
    if (now - timestamp > maxAge) {
      requestLog.delete(ip);
    }
  }

  console.log(`[${new Date().toISOString()}] Rate limiter cleanup: ${requestLog.size} active IPs`);
}
