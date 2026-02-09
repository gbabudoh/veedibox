"use server";

import { prisma } from "@/app/lib/db";

export async function getMasterclasses() {
  try {
    const masterclasses = await prisma.masterclass.findMany({
      orderBy: { rating: "desc" },
    });
    return { success: true, data: masterclasses };
  } catch (error) {
    console.error("Error fetching masterclasses:", error);
    return { success: false, error: "Failed to fetch masterclasses" };
  }
}

export async function getMasterclassByCategory(category: string) {
  try {
    const masterclasses = await prisma.masterclass.findMany({
      where: { category },
    });
    return { success: true, data: masterclasses };
  } catch (error) {
    console.error("Error fetching masterclasses by category:", error);
    return { success: false, error: "Failed to fetch masterclasses" };
  }
}
