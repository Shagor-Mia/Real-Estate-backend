const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    // Validate role
    if (!["user", "admin", "superAdmin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Login User (Set Token in Cookies)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Set token as HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.json({ message: "Login successful", role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Logout (Clear Cookie)
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Users (Only for SuperAdmin)
exports.getAllUsersForSuperAdmin = async (req, res) => {
  try {
    if (req.user.role !== "superAdmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single User (Only for SuperAdmin)
exports.getSingleUserForSuperAdmin = async (req, res) => {
  try {
    if (req.user.role !== "superAdmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Users (Only for Admin - Excluding SuperAdmin)
exports.getAllUsersForAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Exclude SuperAdmins
    const users = await User.findAll({ where: { role: ["user", "admin"] } });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get Single User (Only for Admin - Excluding SuperAdmin)
exports.getSingleUserForAdmin = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Admins cannot view superAdmins
    if (user.role === "superAdmin") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
