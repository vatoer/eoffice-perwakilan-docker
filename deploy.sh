#!/bin/bash

git pull https://github.com/vatoer/eoffice-perwakilan-docker.git

pnpm install

# Generate a new AUTH_SECRET
NEW_AUTH_SECRET=$(openssl rand -hex 32)

# Update the .env.local file
echo "AUTH_SECRET=$NEW_AUTH_SECRET" > .env.local

pnpm prisma generate --schema ./prisma/db-edispo/schema.prisma
pnpm prisma generate --schema ./prisma/db-penomoran/schema.prisma

pnpm build