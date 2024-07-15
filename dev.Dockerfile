FROM node:20-alpine

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
RUN pnpm prisma generate --schema ./prisma/db-edispo/linux.schema.prisma
RUN pnpm prisma generate --schema ./prisma/db-penomoran/linux.schema.prisma


CMD [ "pnpm","dev" ]