import User from "../models/User.js";

//middleware to check authentication

export const protect = async (req, res, next) => {
  const { userId } = req.auth;
  if (!userId) {
    req.json({ success: false, message: "Not Authorized" });
  } else {
    const user = await User.findById(userId);
    req.user = user;
    next();
  }
};
