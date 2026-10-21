import { v2 as cloudinary } from "cloudinary";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;
    const hotel = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "No hotel Found" });
    }
    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path);
      return response.secure_url;
    });

    const images = await Promise.all(uploadImages);

    //addign +in front will convert the string "pricePerNight" To a Number
    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
    });

    res
      .status(201)
      .json({ success: true, message: "Room created successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getRooms = async (req, res) => {
  try {
    //first populate fetch fetch the hotel which the room is from
    //after that the second populate fetches owner and its image from that hotel
    const rooms = await Room.find({ isAvailable: true })
      .populate({
        path: "hotel",
        populate: {
          path: "owner",
          select: "image",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, rooms });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getOwnerRooms = async (req, res) => {
  try {
    const hotelData = await Hotel({ owner: req.auth.userId });
    const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate(
      "hotel",
    );
    res.status(200).json({ success: true, rooms });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;

    const roomData = await Room.findById(roomId);

    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();
    res
      .status(200)
      .json({ success: true, message: "Room availability Updated" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
