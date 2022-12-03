import { prisma } from "@/config";
import { Booking } from "@prisma/client";

async function findBookingByUserId(userId: number) {
  return prisma.booking.findFirst({
    select: {
      id: true,
      Room: true,
    },
    where: {
      userId,
    },
  });
}

async function createBooking(booking: CreateBookingParams) {
  return prisma.booking.create({
    data: {
      ...booking,
    },
  });
}

export type CreateBookingParams = Omit<Booking, "id" | "createdAt" | "updatedAt">;

const bookingRepository = {
  findBookingByUserId,
  createBooking,
};

export default bookingRepository;
