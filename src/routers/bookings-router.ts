import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getBooking, createBooking } from "@/controllers";

const bookingsRouter = Router();

bookingsRouter.all("/*", authenticateToken).get("", getBooking).post("", createBooking);

export { bookingsRouter };
