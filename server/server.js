require("dotenv").config();

console.log("Environment Loaded");

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/database");

const contactRoutes = require("./routes/contactRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const airtimeRoutes = require("./routes/airtimeRoutes");
const bundleRoutes = require("./routes/bundleRoutes");
const voiceRoutes = require("./routes/voiceRoutes");
const smsRoutes = require("./routes/smsRoutes");
const authRoutes = require("./routes/auth");
const financialRoutes = require("./routes/financialRoutes");
const loanRoutes = require("./routes/loanRoutes");
const cardRoutes = require("./routes/cardRoutes");
const statementRoutes = require("./routes/statementRoutes");
const subscriptionRoutes = require("./routes/subscription");
const startSubscriptionExpiryJob =
   require("./jobs/subscriptionExpiry");


const app = express();

// Connect Database
connectDB();

/* ==========================================
   START AUTOMATIC SUBSCRIPTION EXPIRY
========================================== */

startSubscriptionExpiryJob();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/contacts", contactRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/airtime", airtimeRoutes);
app.use("/api/bundles", bundleRoutes);
app.use("/api/voice", voiceRoutes);
app.use("/api/sms", smsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/financial", financialRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/statements", statementRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// Test Route
app.get("/", (req, res) => {

   res.json({
      success: true,
      app: "Kenya Smart Dialer Pro API",
      version: "1.0.0",
      status: "Running"
   });

});
app.get("/health", (req, res) => {

   res.status(200).json({

      status: "OK",

      database: "Connected",

      uptime: process.uptime()

   });

});

const PORT = process.env.PORT || 3000;

app.use((req, res) => {

   res.status(404).json({

      success: false,

      message: "API Route Not Found"

   });

});

app.use((err, req, res, next) => {

   console.error(err.stack);

   res.status(500).json({

      success: false,

      message: "Internal Server Error"

   });

});

app.listen(PORT, "0.0.0.0", () => {

   console.log(`Server running on port ${PORT}`);

});