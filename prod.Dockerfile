FROM node:20-alpine as base

# Step 1. Rebuild the source code only when needed
FROM base AS installer

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

# Install dependencies based on the preferred package manager
# RUN echo "Install dependencies based on the preferred package manager"
COPY package.json pnpm-lock.yaml* ./

COPY src ./src
COPY public ./public
COPY components.json ./components.json
COPY prod.docker.next.config.mjs ./next.config.mjs
COPY tsconfig.json ./tsconfig.json
COPY tailwind.config.ts ./tailwind.config.ts
COPY postcss.config.mjs ./postcss.config.mjs

RUN corepack enable pnpm && pnpm i

# Generate Prisma Client
# COPY node_modules ./node_modules
COPY prisma/db-edispo/linux.schema.prisma ./prisma/db-edispo/linux.schema.prisma
COPY prisma/db-penomoran/linux.schema.prisma ./prisma/db-penomoran/linux.schema.prisma
RUN pnpm prisma generate --schema ./prisma/db-edispo/linux.schema.prisma
RUN pnpm prisma generate --schema ./prisma/db-penomoran/linux.schema.prisma

COPY .env.prod.local ./.env

WORKDIR /
ADD executeMeWhenReady.sh /executeMeWhenReady.sh
# <https://stackoverflow.com/questions/37419042/container-command-start-sh-not-found-or-does-not-exist-entrypoint-to-contain>
# here we make sure that the script has unix line endings
RUN sed -i 's/\r$//' executeMeWhenReady.sh  && \  
    chmod +x executeMeWhenReady.sh

# Add docker-compose-wait tool -------------------
ENV WAIT_VERSION 2.12.1
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

# Add wait-for-it script
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh


CMD /wait && /executeMeWhenReady.sh
