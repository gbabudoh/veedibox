import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "filmmaker@veedibox.com";
  const password = "demo1234";

  console.log(`Checking user: ${email}`);
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.error("User not found!");
    return;
  }

  console.log("User found:", user.role);
  console.log("Stored hash:", user.password);

  if (!user.password) {
    console.error("No password stored!");
    return;
  }

  const isValid = await bcrypt.compare(password, user.password);
  console.log(`Password '${password}' is valid: ${isValid}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
