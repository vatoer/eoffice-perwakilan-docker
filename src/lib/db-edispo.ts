import { PrismaClient } from "@prisma-dbedispo/client";

declare global {
  var prismaEdispo: PrismaClient | undefined;
}

const isProduction = process.env.NODE_ENV === "production";

export const dbEdispo =
  global.prismaEdispo ||
  new PrismaClient({
    //log: isProduction ? [] : ["query"],
  });

if (!isProduction) global.prismaEdispo = dbEdispo;
