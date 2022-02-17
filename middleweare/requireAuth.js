import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ErrorResponse from "../helpers/errorResponse.js";
import asyncHandler from "./asyncHandler.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id);
      next();
    } catch (error) {
      next(new ErrorResponse("Invalid token - Authorization declined", 403));
    }
  } else {
    next(new ErrorResponse("No Token provided - Authorization declined", 403));
  }
};

export default protect;
