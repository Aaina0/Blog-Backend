import jwt from "jsonwebtoken";
import { CustomError } from "./errorHandler.js";

const protect = (req, res, next) => {
  let token;

  // Check if token is present in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      console.log("Token:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;

      next();
    } catch (error) {
      return next(new CustomError(401, "Not authorized, token failed"));
    }
  } else {
    return next(new CustomError(401, "Not authorized, no token"));
  }
};

export { protect };
