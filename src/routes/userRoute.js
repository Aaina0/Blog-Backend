import express from "express";
import {
  directResetPassword,
  forgotPassword,
  verifyUser,
} from "../controllers/userController.js";

const app = express.Router();

app.post("/verify", verifyUser);

app.post("/forgot-password", forgotPassword);
app.put("/reset-password-direct", directResetPassword);

export default app;
