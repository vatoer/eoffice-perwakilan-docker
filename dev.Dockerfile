FROM node:18-alpine

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


# COPY src ./src
# COPY public ./public
# COPY next.config.mjs .
# COPY tsconfig.json .
# COPY tailwind.config.ts .
# COPY postcss.config.mjs .
# COPY components.json .

# Create the necessary directories
# RUN mkdir -p /uploads/KELUAR /uploads/MASUK /uploads/TMP 
# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at run time
ENV NEXT_TELEMETRY_DISABLED 1

# Generate Prisma Client
# COPY node_modules ./node_modules
COPY prisma/db-edispo/linux.schema.prisma ./prisma/db-edispo/linux.schema.prisma
COPY prisma/db-penomoran/linux.schema.prisma ./prisma/db-penomoran/linux.schema.prisma
RUN yarn prisma generate --schema ./prisma/db-edispo/linux.schema.prisma
RUN yarn prisma generate --schema ./prisma/db-penomoran/linux.schema.prisma




# Note: Don't expose ports here, Compose will handle that for us

# Start Next.js in development mode based on the preferred package manager
# CMD \
#     if [ -f yarn.lock ]; then yarn dev; \
#     elif [ -f package-lock.json ]; then npm run dev; \
#     elif [ -f pnpm-lock.yaml ]; then pnpm dev; \
#     else npm run dev; \
#     fi

# CMD [ "pnpm","start" ]
CMD [ "yarn","dev" ]