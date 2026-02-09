import "dotenv/config";
import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const demoPassword = "demo1234";

const users = [
  {
    email: "filmmaker@veedibox.com",
    password: demoPassword,
    name: "Marcus Thorne",
    role: UserRole.CREATOR,
  },
  {
    email: "viewer@veedibox.com",
    password: demoPassword,
    name: "John Cinema",
    role: UserRole.VIEWER,
  },
  {
    email: "admin@veedibox.com",
    password: demoPassword,
    name: "System Administrator",
    role: UserRole.ADMIN,
  },
];

async function main() {
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, role: user.role, password: hashedPassword },
      create: {
        email: user.email,
        password: hashedPassword,
        name: user.name,
        role: user.role,
      },
    });
    console.log(`Upserted user: ${user.email}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
