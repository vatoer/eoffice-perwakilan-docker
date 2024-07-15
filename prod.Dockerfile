FROM node:20-alpine

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED 1

# Install dependencies based on the preferred package manager
# RUN echo "Install dependencies based on the preferred package manager"
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

COPY src ./src
COPY public ./public
COPY components.json ./components.json
COPY next.config.mjs ./next.config.mjs
COPY tsconfig.json ./tsconfig.json
COPY tailwind.config.ts ./tailwind.config.ts
COPY postcss.config.mjs ./postcss.config.mjs

RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
    # Allow install without lockfile, so example works even without Node.js installed locally
    else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
    fi

# Generate Prisma Client
# COPY node_modules ./node_modules
COPY prisma/db-edispo/linux.schema.prisma ./prisma/db-edispo/linux.schema.prisma
COPY prisma/db-penomoran/linux.schema.prisma ./prisma/db-penomoran/linux.schema.prisma
RUN yarn prisma generate --schema ./prisma/db-edispo/linux.schema.prisma
RUN yarn prisma generate --schema ./prisma/db-penomoran/linux.schema.prisma


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


CMD /wait && /executeMeWhenReady.sh