const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const { sequelize } = require("./config/db");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);

// Database connection
const connectDB = async () => {
  try {
    await sequelize.sync();
    console.log("Database connected");
  } catch (err) {
    console.error("DB Error:", err);
    process.exit(1); // Exit process with failure
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
