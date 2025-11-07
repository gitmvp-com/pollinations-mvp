FROM node:22-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm clean-install --omit=dev

# Copy source code
COPY src ./src
COPY .env.example ./.env.example

# Expose port
EXPOSE 16384

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
