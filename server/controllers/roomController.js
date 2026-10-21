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

    res.status(201).json({success: true, message: "Room created successfully"});
  } catch (error) {
    res.status(400).json({success: false, message: error.message});
  }
};

export const getRooms = async (req, res) => {
  try {
  } catch (error) {}
};

export const getOwnerRooms = async (req, res) => {
  try {
  } catch (error) {}
};

export const toggleRoomAvailability = async (req, res) => {
  try {
  } catch (error) {}
};
