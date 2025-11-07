import http from 'http';
import { parse } from 'url';
import { generateImage } from './generator.js';
import { checkRateLimit, cleanupOldEntries } from './rateLimiter.js';
import { getClientIp, sanitizePrompt } from './utils.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 16384;
const MODELS = ['flux', 'turbo'];

// Set CORS headers
const setCORSHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

// Handle requests
const requestHandler = async (req, res) => {
  setCORSHeaders(res);

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const { pathname, query } = parse(req.url, true);

  try {
    // Health check endpoint
    if (pathname === '/' || pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ok',
        message: 'Pollinations MVP - Image Generation API',
        endpoints: {
          generate: '/prompt/{your_prompt}',
          models: '/models'
        },
        version: '1.0.0'
      }));
      return;
    }

    // List available models
    if (pathname === '/models') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(MODELS));
      return;
    }

    // Image generation endpoint
    if (pathname.startsWith('/prompt/')) {
      const clientIp = getClientIp(req);
      
      // Check rate limit
      const rateLimitCheck = checkRateLimit(clientIp);
      if (!rateLimitCheck.allowed) {
        res.writeHead(429, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Too Many Requests',
          message: `Please wait ${Math.ceil(rateLimitCheck.waitTime / 1000)} seconds before making another request`,
          retryAfter: Math.ceil(rateLimitCheck.waitTime / 1000)
        }));
        return;
      }

      // Extract prompt from URL
      const encodedPrompt = pathname.split('/prompt/')[1];
      if (!encodedPrompt) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Bad Request',
          message: 'Prompt is required. Use /prompt/{your_prompt}'
        }));
        return;
      }

      const prompt = sanitizePrompt(decodeURIComponent(encodedPrompt));

      // Parse parameters
      const params = {
        width: parseInt(query.width) || 1024,
        height: parseInt(query.height) || 1024,
        seed: query.seed ? parseInt(query.seed) : Math.floor(Math.random() * 1000000),
        model: MODELS.includes(query.model) ? query.model : 'flux',
        enhance: query.enhance === 'true'
      };

      console.log(`[${new Date().toISOString()}] Generating image for IP: ${clientIp}`);
      console.log(`Prompt: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"}`);
      console.log(`Parameters:`, params);

      // Generate image
      const imageBuffer = await generateImage(prompt, params);

      // Create filename from prompt
      const filename = prompt
        .slice(0, 50)
        .replace(/[^a-z0-9\s-]/gi, '')
        .replace(/\s+/g, '-')
        .toLowerCase() || 'generated-image';

      // Return image
      res.writeHead(200, {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `inline; filename="${filename}.jpg"`,
        'Cache-Control': 'public, max-age=31536000, immutable'
      });
      res.end(imageBuffer);
      
      console.log(`[${new Date().toISOString()}] Image generated successfully`);
      return;
    }

    // 404 for unknown endpoints
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Not Found',
      message: 'The requested endpoint was not found',
      availableEndpoints: ['/prompt/{prompt}', '/models', '/health']
    }));

  } catch (error) {
    console.error('Error handling request:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Internal Server Error',
      message: error.message || 'An unexpected error occurred'
    }));
  }
};

// Create server
const server = http.createServer(requestHandler);

// Cleanup old rate limit entries every hour
setInterval(cleanupOldEntries, 3600000);

// Start server
server.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🌸 Pollinations MVP - Image Generation API');
  console.log('='.repeat(60));
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`\n📝 Example usage:`);
  console.log(`   curl "http://localhost:${PORT}/prompt/sunset%20over%20ocean" > sunset.jpg`);
  console.log(`\n🔧 Available endpoints:`);
  console.log(`   GET /prompt/{prompt}  - Generate image`);
  console.log(`   GET /models           - List available models`);
  console.log(`   GET /health           - Health check`);
  console.log(`\n⚙️  Configuration:`);
  console.log(`   Rate Limit: ${process.env.RATE_LIMIT_INTERVAL || 30000}ms between requests`);
  console.log(`   Models: flux, turbo`);
  console.log('\n' + '='.repeat(60) + '\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
