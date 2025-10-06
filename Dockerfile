# Stage 1: Build the application
FROM node:20-alpine AS builder

# Install dependencies for node-gyp
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install pnpm and dependencies
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Set environment variables for build
ENV NODE_ENV production

# Build the application
RUN pnpm run build

# Stage 2: Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY /start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Set the user to non-root
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Set the hostname to 0.0.0.0 to allow external connections
ENV HOSTNAME "0.0.0.0"

# Start the application
#CMD ["node", "server.js"]
CMD ["/app/start.sh"]
