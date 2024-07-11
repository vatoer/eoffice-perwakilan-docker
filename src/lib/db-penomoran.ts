import { PrismaClient } from "@prisma-dbpenomoran/client";

declare global {
  var prismaPenomoran: PrismaClient | undefined;
}

const isProduction = process.env.NODE_ENV === "production";

export const dbPenomoran =
  global.prismaPenomoran ||
  new PrismaClient({
    log: isProduction ? [] : ["query"],
  });

if (!isProduction) global.prismaPenomoran = dbPenomoran;
