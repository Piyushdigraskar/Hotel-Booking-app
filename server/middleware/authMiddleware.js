import User from "../models/User.js";

//middleware to check authentication

export const protect = async (req, res, next) => {
  try {
    const { userId } = req.auth;
    if (!userId) {
      res.status(401).json({ success: false, message: "Not Authorized" });
    } else {
      const user = await User.findById(userId);
      req.user = user;
      next();
    }
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized, token failed" });
  }
};
