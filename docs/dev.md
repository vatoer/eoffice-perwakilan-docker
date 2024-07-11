# development proses

reference
<https://ui.shadcn.com/docs/installation/next>

## create project

```ssh
mkdir eoffice
cd eoffice
pnpm create next-app@latest . --typescript --tailwind --eslint
```

## install shadcn

## install package

## Install NextAuth 5

ref : <https://authjs.dev/getting-started/installation?framework=next.js>

```sh
pnpm add next-auth@beta
```

add config to `.env.local`

## setup prisma

```sh
pnpm add -D prisma
```

- create prisma schema

```sh
pnpm prisma init
```

buat schema sesuai db

```sh
cd ./prisma
mkdir db-edispo
pnpm prisma db pull --schema ./prisma/db-edispo/schema.prisma
pnpm prisma generate --schema ./prisma/db-edispo/schema.prisma

pnpm prisma db pull --schema ./prisma/db-penomoran/schema.prisma
pnpm prisma generate --schema ./prisma/db-penomoran/schema.prisma
```

### extend authjs

create new types 'next-auth-d.ts'
