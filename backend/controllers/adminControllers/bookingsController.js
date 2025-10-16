import Booking from "../../models/BookingModel.js";
import Vehicle from "../../models/vehicleModel.js";
import { errorHandler } from "../../utils/error.js";

export const allBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.aggregate([
      {
        $lookup: {
          from: "vehicles",
          localField: "vehicleId",
          foreignField: "_id",
          as: "vehicleDetails",
        },
      },
      {
        $unwind: {
          path: "$vehicleDetails",
        },
      },
    ]);

    if (!bookings) {
      next(errorHandler(404, "no bookings found"));
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "error in allBookings"));
  }
};

//chnage bookings status

export const changeStatus = async (req, res, next) => {
  try {
    if (!req.body) {
      next(errorHandler(409, "bad request vehicle id and new status needed"));
      return;
    }
    const { id, status } = req.body;

    const statusChanged = await Booking.findByIdAndUpdate(id, {
      status: status,
    });

    if (!statusChanged) {
      next(errorHandler(404, "status not changed or wrong id"));
      return;
    }
    res.status(200).json({ message: "status changed" });
  } catch (error) {
    console.log(error);
    next(errorHandler(500, "error in changeStatus"));
  }
};
