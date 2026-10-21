import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createRoom } from "../controllers/roomController.js";
import upload from "../middleware/uploadmiddleware.js";

const roomRouter = express.Router();

roomRouter.post("/", upload.array("images", 4), protect, createRoom);

export default roomRouter;
