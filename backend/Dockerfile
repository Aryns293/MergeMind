# Build stage
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Install OpenSSL (required by Prisma on alpine)
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies including devDependencies for Prisma generation
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Production stage
FROM node:22-alpine AS production

# Set node environment to production
ENV NODE_ENV=production

# Install OpenSSL (required by Prisma on alpine)
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy generated Prisma client from builder
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma

# Copy application source code
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/docs ./docs

# Use non-root user for security
USER node

# Expose port
EXPOSE 5000

# Start command
CMD ["npm", "start"]
