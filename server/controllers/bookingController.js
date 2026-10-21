import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

const checkAvailaibility = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $lte: checkInDate },
    });

    const isAvailable = bookings.length === 0;

    return isAvailable;
  } catch (error) {
    console.error(error.message);
  }
};

export const checkAvailaibilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailaibility({
      checkInDate,
      checkOutDate,
      room,
    });

    res.status(200).json({ success: true, isAvailable });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user._id;

    const isAvailable = await await checkAvailaibility({
      checkInDate,
      checkOutDate,
      room,
    });

    if (!isAvailable) {
      return res
        .status(404)
        .json({ success: false, message: "Room is not Available" });
    }

    const roomData = Room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const timeDiff = checkOut.getTime() - checkIn.getTime();

    //doing calculations in millieseconds
    //(1000 * 3600 * 24) calculates millieseconds in a day
    const numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    totalPrice *= numberOfNights;

    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });
    res
      .status(201)
      .json({ success: true, message: "Booking created successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;
    //space between "room hotel" acts as an "AND
    const bookings = await Booking.find({ user })
      .populate("room hotel")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getHotelookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.auth.userId });

    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "No hotel found" });
    }
    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });
    //total bookings

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce(
      (acc, booking) => acc + bookin.totalPrice,
      0,
    );

    res.status(200).json({
      success: true,
      dashboardData: { totalBookings, totalRevenue, bookings },
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Failed to Fetch Bookings" });
  }
};
