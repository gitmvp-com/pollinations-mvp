import fetch from 'node-fetch';

const IMAGE_API_URL = process.env.IMAGE_API_URL || 'https://image.pollinations.ai/prompt';

/**
 * Generate an image from a text prompt
 * @param {string} prompt - The text description
 * @param {object} params - Generation parameters
 * @returns {Promise<Buffer>} - Image buffer
 */
export async function generateImage(prompt, params = {}) {
  const { width = 1024, height = 1024, seed, model = 'flux', enhance = false } = params;

  // Build URL with parameters
  const url = new URL(`${IMAGE_API_URL}/${encodeURIComponent(prompt)}`);
  url.searchParams.append('width', width);
  url.searchParams.append('height', height);
  url.searchParams.append('seed', seed);
  url.searchParams.append('model', model);
  url.searchParams.append('nologo', 'true');
  
  if (enhance) {
    url.searchParams.append('enhance', 'true');
  }

  console.log(`Requesting image from: ${url.toString()}`);

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'Pollinations-MVP/1.0'
      },
      timeout: 120000 // 2 minute timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Image generation failed: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      throw new Error(`Expected image response, got ${contentType}`);
    }

    const buffer = await response.buffer();
    
    if (!buffer || buffer.length === 0) {
      throw new Error('Received empty image buffer');
    }

    console.log(`Image generated successfully (${buffer.length} bytes)`);
    return buffer;

  } catch (error) {
    console.error('Error generating image:', error.message);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}
