import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    const error = new Error("JWT_SECRET is not configured");
    error.status = 500;
    throw error;
  }

  return secret;
};

const normalizeAuthInput = ({ username, email, password } = {}) => ({
  username: typeof username === "string" ? username.trim() : "",
  email: typeof email === "string" ? email.trim().toLowerCase() : "",
  password: typeof password === "string" ? password : ""
});

const createToken = (user) => jwt.sign(
  { id: user._id.toString(), username: user.username },
  getJwtSecret(),
  { expiresIn: TOKEN_EXPIRES_IN }
);

const serializeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email
});

const handleAuthError = (res, error) => {
  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "User already exists with this email or username"
    });
  }

  return res.status(error.status || 500).json({
    success: false,
    message: error.message
  });
};

export async function register(req, res) {
  try {
    const { username, email, password } = normalizeAuthInput(req.body);

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are required"
      });
    }

    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({
        success: false,
        message: "Username must be between 3 and 30 characters"
      });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters"
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or username"
      });
    }

    // Create user
    const user = await User.create({ username, email, password });

    // Generate token
    const token = createToken(user);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: serializeUser(user)
    });

  } catch (error) {
    handleAuthError(res, error);
  }
}

export async function login(req, res) {
  try {
    const { email, password } = normalizeAuthInput(req.body);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate token
    const token = createToken(user);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: serializeUser(user)
    });

  } catch (error) {
    handleAuthError(res, error);
  }
}

export async function me(req, res) {
  res.json({
    success: true,
    user: serializeUser(req.user)
  });
}
