import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/bookings-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const booking = await bookingService.getBookingByUserId(userId);

    return res.status(httpStatus.OK).send({ bookingId: booking.id });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "ForbiddenError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const { roomId } = req.body;

  if (!roomId || roomId <= 0 || typeof roomId !== "number") {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const newBooking = await bookingService.createBooking(userId, roomId);

    return res.status(httpStatus.OK).send({ bookingId: newBooking.id });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "ForbiddenError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
    if (error.name === "ConflictError") {
      return res.status(httpStatus.CONFLICT).send(error.message);
    }
  }
}

export async function changeBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  const bookingId = Number(req.params.bookingId);

  if (!roomId || roomId <= 0 || typeof roomId !== "number") {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  if (!bookingId || bookingId <= 0 || typeof bookingId !== "number") {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const changeBooking = await bookingService.changeBooking(userId, roomId, bookingId);

    return res.status(httpStatus.OK).send({ bookingId: changeBooking.id });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "ForbiddenError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
  }
}
