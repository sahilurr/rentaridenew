import BookingsTable from "./BookingsTable";

const Bookings = () => {
  return (
    <div className="mt-4">
      <div className="my-4 mb-8">
        <h2 className="font-bold text-lg">User Bookings</h2>
      </div>
      <BookingsTable />
    </div>
  );
};

export default Bookings;
