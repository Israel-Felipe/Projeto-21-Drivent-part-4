import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getBooking, createBooking, changeBooking } from "@/controllers";

const bookingsRouter = Router();

bookingsRouter
  .all("/*", authenticateToken)
  .get("", getBooking)
  .post("", createBooking)
  .put("/:bookingId", changeBooking);

export { bookingsRouter };
