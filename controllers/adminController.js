import { User } from "../models/User.js";

const serializeManagedUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  isSuspended: Boolean(user.isSuspended),
  suspendedAt: user.suspendedAt,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export async function getUsers(req, res) {
  try {
    const status = req.query.status || "active";
    const filter = {};

    if (status === "active") {
      filter.isSuspended = { $ne: true };
    } else if (status === "suspended") {
      filter.isSuspended = true;
    }

    const users = await User.find(filter)
      .select("_id username email isSuspended suspendedAt createdAt updatedAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users.map(serializeManagedUser)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
}

export async function suspendUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isSuspended: true,
        suspendedAt: new Date()
      },
      {
        new: true,
        runValidators: true
      }
    ).select("_id username email isSuspended suspendedAt createdAt updatedAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User suspended successfully",
      data: serializeManagedUser(user)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
}

export async function activateUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isSuspended: false,
        suspendedAt: null
      },
      {
        new: true,
        runValidators: true
      }
    ).select("_id username email isSuspended suspendedAt createdAt updatedAt");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User activated successfully",
      data: serializeManagedUser(user)
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
}
