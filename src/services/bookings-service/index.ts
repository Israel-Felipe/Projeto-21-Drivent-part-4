import { notFoundError, forbiddenError, conflictError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import roomRepository from "@/repositories/hotel-repository";

async function getBookingByUserId(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw forbiddenError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

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

  const room = await roomRepository.findRoomsByRoomId(roomId);

  if (!room) {
    throw notFoundError();
  }

  const bookingsInRoomId = await bookingRepository.findBookingByRoomId(roomId);

  if (bookingsInRoomId.length >= room.capacity) {
    throw forbiddenError();
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

async function changeBooking(userId: number, roomId: number, bookingId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw forbiddenError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  const bookingCurrent = await bookingRepository.findBookingByBookingId(bookingId);
  const room = await roomRepository.findRoomsByRoomId(roomId);

  if (!room || !bookingCurrent) {
    throw notFoundError();
  }
  if (bookingCurrent.userId !== userId || bookingCurrent.roomId === roomId) {
    throw forbiddenError();
  }

  const bookingsInRoomId = await bookingRepository.findBookingByRoomId(roomId);

  if (bookingsInRoomId.length >= room.capacity) {
    throw forbiddenError();
  }

  await bookingRepository.changeBooking(bookingId, roomId);

  const booking = await bookingRepository.findBookingByUserId(userId);

  return booking;
}

const bookingService = {
  getBookingByUserId,
  createBooking,
  changeBooking,
};

export default bookingService;
