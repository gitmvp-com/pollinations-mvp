/**
 * Extract client IP from request
 * @param {object} req - HTTP request object
 * @returns {string} - Client IP address
 */
export function getClientIp(req) {
  // Check various headers for the real IP
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return realIp;
  }

  // Fall back to socket address
  return req.socket.remoteAddress || 'unknown';
}

/**
 * Sanitize prompt to prevent injection
 * @param {string} prompt - User input prompt
 * @returns {string} - Sanitized prompt
 */
export function sanitizePrompt(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    return '';
  }

  // Remove excessive whitespace
  let sanitized = prompt.trim().replace(/\s+/g, ' ');

  // Limit length
  if (sanitized.length > 500) {
    sanitized = sanitized.substring(0, 500);
  }

  return sanitized;
}
