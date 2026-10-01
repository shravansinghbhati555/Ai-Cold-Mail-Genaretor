const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");

dotenv.config();

// Required environment variables
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "GROQ_API_KEY"];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`,
  );
  process.exit(1);
}

// Connect MongoDB
connectDB();

const app = express();

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

// Client production build
const clientBuildPath = path.join(
  __dirname,
  "..",
  "client",
  "Ai-Cold-Mail-Generator",
  "dist",
);

// Serve React static files
app.use(express.static(clientBuildPath));

// React SPA fallback
app.use((req, res, next) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  } else {
    next();
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Server Error",
    error: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
