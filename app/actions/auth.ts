"use server";

import { prisma } from "@/app/lib/db";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

export async function registerUser(data: {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      return { success: false, error: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role || UserRole.VIEWER,
      }
    });

    return { success: true, user: { id: user.id, email: user.email, name: user.name } };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Something went wrong" };
  }
}
