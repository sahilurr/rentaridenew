import Booking from "../models/BookingModel.js";
import Vehicle from "../models/vehicleModel.js";

//returning vehicles that are not booked in selected Date
export async function availableAtDate(pickupDate, dropOffDate) {
  try {
    //this condition only checked vehicles without booking it only checked dates it dose not checked status of trip

    // const existingBookings = await Booking.find({
    //   $or: [
    //     { pickupDate: { $lt: dropOffDate }, dropOffDate: { $gt: pickupDate } }, // Overlap condition
    //     { pickupDate: { $gte: pickupDate, $lt: dropOffDate } }, // Start within range
    //     { dropOffDate: { $gt: pickupDate, $lte: dropOffDate } }, // End within range
    //     { pickupDate: { $lte: pickupDate }, dropOffDate: { $gte: dropOffDate } }, // Booking includes the entire time range
    //   ],
    // });

    // const vehicleIds = existingBookings.map(booking => booking.vehicleId);
    // const uniqueVehicleIds = [...new Set(vehicleIds)];

    // const vehiclesWithoutBookings = await Vehicle.find({ _id: { $nin: uniqueVehicleIds } });
    // return vehiclesWithoutBookings || [];

    const existingBookings = await Booking.find({
      $or: [
        { pickupDate: { $lt: dropOffDate }, dropOffDate: { $gt: pickupDate } }, // Overlap condition
        { pickupDate: { $gte: pickupDate, $lt: dropOffDate } }, // Start within range
        { dropOffDate: { $gt: pickupDate, $lte: dropOffDate } }, // End within range
        {
          pickupDate: { $lte: pickupDate },
          dropOffDate: { $gte: dropOffDate },
        }, // Booking includes the entire time range
      ],
    });

    const vehicleIds = existingBookings.map((booking) => booking.vehicleId);
    const uniqueVehicleIds = [...new Set(vehicleIds)];

    // Find vehicles with status "tripCompleted" during the specified date range
    const vehiclesWithCompletedTrips = await Booking.find(
      {
        $or: [
          { status: "tripCompleted" },
          { status: "canceled" },
          { status: "notBooked" },
        ],
        pickupDate: { $lt: dropOffDate },
        dropOffDate: { $gt: pickupDate },
      },
      { vehicleId: 1 }
    );

    const vehicleIdsWithCompletedTrips = vehiclesWithCompletedTrips.map(
      (booking) => booking.vehicleId
    );

    const vehiclesWithoutBookings = await Vehicle.find({
      $or: [
        { _id: { $nin: uniqueVehicleIds } }, // Vehicles without bookings
        { _id: { $in: vehicleIdsWithCompletedTrips } }, // Vehicles with completed trips
      ],
    });

    return vehiclesWithoutBookings || [];
  } catch (error) {
    console.log(error);
    throw error;
  }
}
