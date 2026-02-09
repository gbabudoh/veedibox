import "dotenv/config";
import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log("Prisma instance created.");
    await prisma.$connect();
    console.log("Connected to DB.");
  } catch (e) {
    console.error("Failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
