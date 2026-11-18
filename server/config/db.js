// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     mongoose.connection.on("connected", () =>
//       console.log("Database connected")
//     );
//     await mongoose.connect(`${process.env.MONGODB_URI}/NomadNest`);
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// export default connectDB;

import mongoose from "mongoose";

// Cache connection globally to survive serverless cold starts
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.connection.on("connected", () =>
      console.log("Database connected"),
    );

    // bufferCommands: false forces it to fail immediately if not connected, rather than timing out after 10s
    cached.promise = mongoose
      .connect(`${process.env.MONGODB_URI}/NomadNest`, {
        bufferCommands: false,
      })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
