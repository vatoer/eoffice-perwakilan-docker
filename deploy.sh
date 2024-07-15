#!/bin/bash

git pull https://github.com/vatoer/eoffice-perwakilan-docker.git

pnpm install

pnpm prisma generate --schema ./prisma/db-edispo/schema.prisma
pnpm prisma generate --schema ./prisma/db-penomoran/schema.prisma

pnpm build