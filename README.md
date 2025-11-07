# 🌸 Pollinations MVP - Image Generation API

> A simplified MVP version of [Pollinations.AI](https://github.com/pollinations/pollinations) focusing on core image generation functionality.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

- ✨ **Simple Image Generation** - Generate images from text prompts via URL
- 🎨 **FLUX Model Support** - Uses advanced AI models for high-quality images
- 🔧 **Customizable Parameters** - Control width, height, seed, and more
- ⚡ **Fast & Lightweight** - Minimal dependencies, easy to deploy
- 🆓 **Free to Use** - No API keys required for basic usage

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/gitmvp-com/pollinations-mvp.git
cd pollinations-mvp

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Start the server
npm start
```

## 🎯 Quick Start

### Start the Server

```bash
npm start
```

The server will start on `http://localhost:16384`

### Generate Your First Image

Open your browser or use curl:

```bash
# Simple generation
curl -o image.jpg "http://localhost:16384/prompt/a%20beautiful%20sunset%20over%20mountains"

# With custom parameters
curl -o image.jpg "http://localhost:16384/prompt/cyberpunk%20city?width=1920&height=1080&seed=42"
```

## 🔧 API Usage

### Generate Image

**Endpoint:** `GET /prompt/{prompt}`

**Parameters:**

| Parameter | Type    | Default | Description                          |
|-----------|---------|---------|--------------------------------------|
| width     | integer | 1024    | Image width in pixels                |
| height    | integer | 1024    | Image height in pixels               |
| seed      | integer | random  | Seed for reproducible results        |
| model     | string  | flux    | Model to use (flux, turbo)           |
| enhance   | boolean | false   | Auto-enhance prompt                  |

**Example:**

```bash
# Generate a landscape image
curl "http://localhost:16384/prompt/mountain%20landscape?width=1920&height=1080&seed=123" > landscape.jpg

# Generate with enhanced prompt
curl "http://localhost:16384/prompt/cute%20cat?enhance=true" > cat.jpg
```

### List Available Models

**Endpoint:** `GET /models`

```bash
curl http://localhost:16384/models
```

**Response:**
```json
["flux", "turbo"]
```

## 🌐 Integration Examples

### Python

```python
import requests
from urllib.parse import quote

prompt = "A serene mountain landscape at sunrise"
url = f"http://localhost:16384/prompt/{quote(prompt)}"
params = {"width": 1280, "height": 720, "seed": 42}

response = requests.get(url, params=params)
with open("image.jpg", "wb") as f:
    f.write(response.content)

print("Image generated successfully!")
```

### JavaScript (Node.js)

```javascript
import fetch from 'node-fetch';
import fs from 'fs';

const prompt = "A futuristic city with flying cars";
const url = `http://localhost:16384/prompt/${encodeURIComponent(prompt)}?width=1280&height=720`;

const response = await fetch(url);
const buffer = await response.buffer();
fs.writeFileSync('city.jpg', buffer);

console.log('Image generated successfully!');
```

### HTML (Direct Image)

```html
<img src="http://localhost:16384/prompt/beautiful%20sunset?width=800&height=600" 
     alt="AI Generated Sunset" />
```

## 🏗️ Architecture

This MVP is intentionally simple:

```
┌─────────────────┐
│  Client Request │
│  /prompt/...    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   HTTP Server   │
│  (Node.js)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Rate Limiter   │
│  (IP-based)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Image Generator │
│ (FLUX API)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Return Image   │
│   (JPEG/PNG)    │
└─────────────────┘
```

## 📁 Project Structure

```
pollinations-mvp/
├── src/
│   ├── index.js          # Main server
│   ├── generator.js      # Image generation logic
│   ├── rateLimiter.js    # Simple rate limiting
│   └── utils.js          # Helper functions
├── .env.example          # Environment template
├── package.json          # Dependencies
└── README.md            # Documentation
```

## 🔐 Configuration

Edit `.env` to customize:

```env
# Server port
PORT=16384

# Image generation API (default: Pollinations public API)
IMAGE_API_URL=https://image.pollinations.ai/prompt

# Rate limiting (milliseconds between requests)
RATE_LIMIT_INTERVAL=30000
```

## 🚀 Deployment

### Docker

```bash
# Build
docker build -t pollinations-mvp .

# Run
docker run -p 16384:16384 pollinations-mvp
```

### Node.js

```bash
# Production mode
NODE_ENV=production npm start
```

## 🤝 Differences from Full Pollinations.AI

This MVP focuses on simplicity and includes only:

✅ **Included:**
- Basic image generation
- Simple rate limiting
- Model selection (flux, turbo)
- Parameter customization

❌ **Not Included (in full version):**
- Advanced authentication system
- Multiple backend services
- Real-time feeds
- Audio generation
- Text generation
- Vision/multimodal features
- React hooks library
- Advanced caching strategies
- Content safety filters
- Analytics & telemetry

## 📚 Learn More

- **Full Pollinations.AI**: [github.com/pollinations/pollinations](https://github.com/pollinations/pollinations)
- **API Documentation**: [Pollinations API Docs](https://github.com/pollinations/pollinations/blob/main/APIDOCS.md)
- **Website**: [pollinations.ai](https://pollinations.ai)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Credits

This MVP is inspired by the amazing work of the [Pollinations.AI](https://pollinations.ai) team. This is a simplified educational version focusing on core image generation features.

---

Made with ❤️ for learning and experimentation
