import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@veedibox.com";
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log("Admin user NOT found.");
  } else {
    console.log("Admin user found:", user);
    // checks password "demo1234"
    if (!user.password) {
      console.log("User found but NO password set (likely OAuth).");
    } else {
      const isValid = await bcrypt.compare("demo1234", user.password);
      console.log("Password 'demo1234' matches:", isValid);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
