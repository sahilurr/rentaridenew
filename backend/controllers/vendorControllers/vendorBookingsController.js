import Booking from '../../models/BookingModel.js'

export const vendorBookings = async (req, res, next) => {
    try {
        const {vendorVehicles}  = req.body
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
  