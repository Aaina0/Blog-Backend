import express from "express";
import morgan from "morgan";
import { config } from "dotenv";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { database } from "./src/database/database.js";
import blogRoutes from "./src/routes/blogRoutes.js";
import userRoutes from "./src/routes/userRoute.js";
import postRoutes from "./src/routes/postRoute.js";
import commentRoutes from "./src/routes/commentRoute.js";

config();

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Hello Backend");
});
app.use("/api/blog", blogRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong!";
  res.status(statusCode).json({ message });
});

// Uncaught Exceptions and Promise Rejections
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  process.exit(1);
});

// Start Server
const Server = async () => {
  try {
    await database();
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error.message);
    process.exit(1);
  }
};

Server();
