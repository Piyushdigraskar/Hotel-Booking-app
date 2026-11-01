import transporter from "../config/nodemailer.js";
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
    res.json({ success: false, message: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests, paymentMethod } = req.body;
    const user = req.user._id;

    const isAvailable = await checkAvailaibility({
      checkInDate,
      checkOutDate,
      room,
    });

    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not Available" });
    }

    const roomData = await Room.findById(room).populate("hotel");
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
      paymentMethod,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: req.user.email,
      subject: "Hotel Booking Details",
      html: `
        <h2>Your Booking Details</h2>
        <p>Dear ${req.user.username}, </p>
        <p>Thank you for your booking at ${roomData.hotel.name}! Here Are your booking details</p>
        <ul>
          <li><strong>Booking Id:</strong> ${booking._id}</li>
          <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
          <li><strong>Location:</strong> ${roomData.hotel.address}</li>
          <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
          <li><strong>Booking Amount:</strong> ${process.env.CURRENCY} ${booking.totalPrice} /per night</li>
        </ul>
        <p>We look forward to welcome you!</p>
        <p>If you need to make any changes feel free to contact us.</p>
      `,
    };
    await transporter.sendMail(mailOptions);

    res
      .status(201)
      .json({ success: true, message: "Booking created successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
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
    res.json({ success: false, message: error.message });
  }
};

export const getHotelookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.auth.userId });

    if (!hotel) {
      return res.json({ success: false, message: "No hotel found" });
    }
    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });
    //total bookings

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0,
    );

    res.status(200).json({
      success: true,
      dashboardData: { totalBookings, totalRevenue, bookings },
    });
  } catch (error) {
    res.json({ success: false, message: "Failed to Fetch Bookings" });
  }
};
