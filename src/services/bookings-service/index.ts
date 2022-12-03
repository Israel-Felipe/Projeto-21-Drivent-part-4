import { notFoundError, forbiddenError, conflictError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import roomRepository from "@/repositories/hotel-repository";

async function getBookingByUserId(userId: number) {
  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!booking) {
    throw notFoundError();
  }

  return booking;
}

async function createBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw forbiddenError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  if (!roomId) {
    throw notFoundError();
  }

  const room = await roomRepository.findRoomsByRoomId(roomId);

  if (!room) {
    throw notFoundError();
  }

  const checkBookingConflitForUserId = await bookingRepository.findBookingByUserId(userId);
  if (checkBookingConflitForUserId) {
    throw conflictError("Já existe uma reserva para este usuário");
  }

  const bookingData = {
    userId: userId,
    roomId: roomId,
  };

  await bookingRepository.createBooking(bookingData);

  const booking = await bookingRepository.findBookingByUserId(userId);

  return booking;
}

const bookingService = {
  getBookingByUserId,
  createBooking,
};

export default bookingService;
