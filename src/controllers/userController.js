import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CustomError } from "../middleware/errorHandler.js";
import asyncHandler from "../middleware/asyncHanddler.js";
import crypto from "crypto";

const verifyUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new CustomError(400, "Email and password are required"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new CustomError(401, "Invalid email"));
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return next(new CustomError(401, "Invalid password"));
  }

  if (!user.is_admin) {
    return next(new CustomError(403, "Access denied"));
  }

  const token = jwt.sign(
    { userId: user._id, isAdmin: user.is_admin },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.is_admin,
    },
  });
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new CustomError(404, "User not found"));
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Reset password token sent to email",
  });
});

const directResetPassword = asyncHandler(async (req, res, next) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return next(new CustomError(400, "Email and new password are required"));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new CustomError(404, "User not found"));
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({ success: true, message: "Password reset successful" });
});

export { verifyUser, forgotPassword, directResetPassword };
