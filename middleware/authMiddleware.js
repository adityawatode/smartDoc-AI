import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    const error = new Error("JWT_SECRET is not configured");
    error.status = 500;
    throw error;
  }

  return secret;
};

export async function protect(req, res, next) {
  try {
    const authHeader = req.get("Authorization") || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token required"
      });
    }

    const decoded = jwt.verify(token, getJwtSecret());

    if (decoded.role === "admin") {
      req.user = {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
        role: "admin"
      };
      return next();
    }

    const user = await User.findById(decoded.id).select("_id username email isSuspended");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token"
      });
    }

    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token"
      });
    }

    next(error);
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required"
    });
  }

  next();
}
