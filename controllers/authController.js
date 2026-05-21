import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const ADMIN_USER = Object.freeze({
  id: "hardcoded-admin",
  username: "Admin",
  email: "admin@smartdoc.ai",
  password: "Admin@12345",
  role: "admin"
});

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

const createUserToken = (user) => jwt.sign(
  {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: "user"
  },
  getJwtSecret(),
  { expiresIn: TOKEN_EXPIRES_IN }
);

const createAdminToken = () => jwt.sign(
  {
    id: ADMIN_USER.id,
    username: ADMIN_USER.username,
    email: ADMIN_USER.email,
    role: ADMIN_USER.role
  },
  getJwtSecret(),
  { expiresIn: TOKEN_EXPIRES_IN }
);

const serializeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: "user",
  isSuspended: Boolean(user.isSuspended)
});

const serializeAdmin = () => ({
  id: ADMIN_USER.id,
  username: ADMIN_USER.username,
  email: ADMIN_USER.email,
  role: ADMIN_USER.role,
  isSuspended: false
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
    const token = createUserToken(user);

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

    if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
      return res.json({
        success: true,
        message: "Admin login successful",
        token: createAdminToken(),
        user: serializeAdmin()
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

    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended"
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
    const token = createUserToken(user);

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
    user: req.user?.role === "admin" ? req.user : serializeUser(req.user)
  });
}
