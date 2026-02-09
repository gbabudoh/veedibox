"use server";

import { prisma } from "@/app/lib/db";

export async function createTicket(data: {
  userId: string;
  movieId: string;
  pricePaid: number;
  seatNumber?: string;
}) {
  try {
    const vbxId = `VBX-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    const ticket = await prisma.ticket.create({
      data: {
        vbxId,
        userId: data.userId,
        movieId: data.movieId,
        pricePaid: data.pricePaid,
        seatNumber: data.seatNumber,
      },
    });
    
    return { success: true, data: ticket };
  } catch (error) {
    console.error("Error creating ticket:", error);
    return { success: false, error: "Failed to create ticket" };
  }
}

export async function getUserTickets(userId: string) {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { userId },
      include: { movie: true },
    });
    return { success: true, data: tickets };
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    return { success: false, error: "Failed to fetch tickets" };
  }
}
