FROM node:20-alpine AS base


# Step 1. Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app

# Install dependencies based on the preferred package manager
# RUN echo "Install dependencies based on the preferred package manager"
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
    # Allow install without lockfile, so example works even without Node.js installed locally
    else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
    fi


ENV NEXT_TELEMETRY_DISABLED 1

# Generate Prisma Client
# COPY node_modules ./node_modules
COPY prisma/db-edispo/linux.schema.prisma ./prisma/db-edispo/linux.schema.prisma
COPY prisma/db-penomoran/linux.schema.prisma ./prisma/db-penomoran/linux.schema.prisma
RUN yarn prisma generate --schema ./prisma/db-edispo/linux.schema.prisma
RUN yarn prisma generate --schema ./prisma/db-penomoran/linux.schema.prisma


# Build Next.js based on the preferred package manager
# - ./volumes/eoffice/src:/app/src
# - ./volumes/eoffice/public:/app/public
# - ./.env.nextjs:/app/.env
# - ./volumes/eoffice/components.json:/app/components.json
# - ./volumes/eoffice/next.config.mjs:/app/next.config.mjs
# - ./volumes/eoffice/tsconfig.json:/app/tsconfig.json
# - ./volumes/eoffice/tailwind.config.ts:/app/tailwind.config.ts
# - ./volumes/eoffice/postcss.config.mjs:/app/postcss.config.mjs
COPY src ./src
COPY public ./public
COPY .env ./.env
COPY components.json ./components.json
COPY next.config.mjs ./next.config.mjs
COPY tsconfig.json ./tsconfig.json
COPY tailwind.config.ts ./tailwind.config.ts
COPY postcss.config.mjs ./postcss.config.mjs

RUN \
    if [ -f yarn.lock ]; then yarn build; \
    elif [ -f package-lock.json ]; then npm run build; \
    elif [ -f pnpm-lock.yaml ]; then pnpm build; \
    else npm run build; \
    fi

# Step 2. Production image, copy all the files and run next
FROM base AS runner

# Set the working directory
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/public ./public
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

CMD ["node", "server.js"]