"use server";

import { prisma } from "@/app/lib/db";

export async function logInteraction(data: {
  movieId: string;
  type: string;
  content?: string;
}) {
  try {
    const interaction = await prisma.interaction.create({
      data: {
        movieId: data.movieId,
        type: data.type,
        content: data.content,
      },
    });
    return { success: true, data: interaction };
  } catch (error) {
    console.error("Error logging interaction:", error);
    return { success: false, error: "Failed to log interaction" };
  }
}

export async function getMovieInteractions(movieId: string) {
  try {
    const interactions = await prisma.interaction.findMany({
      where: { movieId },
      orderBy: { timestamp: "desc" },
      take: 50,
    });
    return { success: true, data: interactions };
  } catch (error) {
    console.error("Error fetching interactions:", error);
    return { success: false, error: "Failed to fetch interactions" };
  }
}
