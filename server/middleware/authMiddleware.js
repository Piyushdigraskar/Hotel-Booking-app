// import User from "../models/User.js";

// //middleware to check authentication

// export const protect = async (req, res, next) => {
//   try {
//     const { userId } = req.auth;
//     if (!userId) {
//       res.status(401).json({ success: false, message: "Not Authorized" });
//     } else {
//       const user = await User.findById(userId);
//       req.user = user;
//       next();
//     }
//   } catch (error) {
//     console.error("Auth Middleware Error:", error.message);
//     return res
//       .status(401)
//       .json({ success: false, message: "Not Authorized, token failed" });
//   }
// };

import User from "../models/User.js";
import connectDB from "../path/to/your/db.js"; // Update this path to match your project

export const protect = async (req, res, next) => {
  try {
    // 1. Ensure DB is connected BEFORE querying
    await connectDB();

    const { userId } = req.auth;
    if (!userId) {
      // Added 'return' to immediately stop execution
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized" });
    }

    const user = await User.findById(userId);
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized, token failed" });
  }
};
