import mongoose from "mongoose";
import { config } from "dotenv";

config();

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("MONGODB_URI is not defined!");
  process.exit(1);
}

export const database = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.error("Database Connection Failed:", error.message);
    throw error;
  }
};
