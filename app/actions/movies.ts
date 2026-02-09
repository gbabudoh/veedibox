"use server";

import { prisma } from "@/app/lib/db";
import { MovieStatus } from "@prisma/client";

export async function getMovies() {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: { releaseDate: "desc" },
    });
    return { success: true, data: movies };
  } catch (error) {
    console.error("Error fetching movies:", error);
    return { success: false, error: "Failed to fetch movies" };
  }
}

export async function getMovieById(id: string) {
  try {
    const movie = await prisma.movie.findUnique({
      where: { id },
      include: { interactions: true },
    });
    return { success: true, data: movie };
  } catch (error) {
    console.error("Error fetching movie:", error);
    return { success: false, error: "Failed to fetch movie" };
  }
}

export async function getLivePremieres() {
  try {
    const movies = await prisma.movie.findMany({
      where: { status: MovieStatus.PREMIERE_LIVE },
    });
    return { success: true, data: movies };
  } catch (error) {
    console.error("Error fetching live premieres:", error);
    return { success: false, error: "Failed to fetch live premieres" };
  }
}
