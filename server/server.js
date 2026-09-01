"use strict";

/* ==========================================
   ENVIRONMENT
========================================== */

const path = require("path");

require("dotenv").config({
   path: path.join(__dirname, ".env")
});

console.log("Environment Loaded");


/* ==========================================
   DEPENDENCIES
========================================== */

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

/* ==========================================
   DATABASE
========================================== */

const connectDB = require("./config/database");


/* ==========================================
   ROUTES
========================================== */

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
const mpesaRoutes = require("./routes/mpesaRoutes");
const initializeCalling =
   require("./services/calling/callingServer");


/* ==========================================
   SUBSCRIPTION EXPIRY JOB
========================================== */

const startSubscriptionExpiryJob =
   require("./jobs/subscriptionExpiry");


/* ==========================================
   EXPRESS APP
========================================== */

const app = express();
const httpServer =
   http.createServer(app);

const io =
   new Server(httpServer, {

      cors: {

         origin: "*",

         methods: [
            "GET",
            "POST"
         ]

      }

   });

initializeCalling(io);


/* ==========================================
   DATABASE CONNECTION
========================================== */

connectDB();


/* ==========================================
   AUTOMATIC SUBSCRIPTION EXPIRY
========================================== */

startSubscriptionExpiryJob();


/* ==========================================
   MIDDLEWARE
========================================== */

app.use(cors());

app.use(express.json());

app.use(
   express.urlencoded({
      extended: true
   })
);


/* ==========================================
   FRONTEND STATIC FILES
========================================== */

/*
   Frontend is located in the project root:

   Kenya-Smart-Diater-Pro/
   ├── index.html
   ├── style.css
   ├── css/
   ├── js/
   ├── assets/
   └── financial/

   server.js is inside:

   Kenya-Smart-Diater-Pro/server/

   Therefore ".." points to the frontend root.
*/

const frontendPath =
   path.join(__dirname, "..");

app.use(
   express.static(frontendPath)
);


/* ==========================================
   API ROUTES
========================================== */

app.use(
   "/api/contacts",
   contactRoutes
);

app.use(
   "/api/transactions",
   transactionRoutes
);
app.use("/api/mpesa", mpesaRoutes);

app.use(
   "/api/airtime",
   airtimeRoutes
);

app.use(
   "/api/bundles",
   bundleRoutes
);

app.use(
   "/api/voice",
   voiceRoutes
);

app.use(
   "/api/sms",
   smsRoutes
);

app.use(
   "/api/auth",
   authRoutes
);

app.use(
   "/api/financial",
   financialRoutes
);

app.use(
   "/api/loans",
   loanRoutes
);

app.use(
   "/api/cards",
   cardRoutes
);

app.use(
   "/api/statements",
   statementRoutes
);

app.use(
   "/api/subscriptions",
   subscriptionRoutes
);


/* ==========================================
   HEALTH CHECK
========================================== */

app.get(
   "/health",
   (req, res) => {

      res.status(200).json({

         status: "OK",

         database: "Connected",

         uptime: process.uptime()

      });

   }
);


/* ==========================================
   FRONTEND ENTRY
========================================== */

app.get(
   "/",
   (req, res) => {

      res.sendFile(
         path.join(
            frontendPath,
            "index.html"
         )
      );

   }
);


/* ==========================================
   404 HANDLER
========================================== */

app.use(
   (req, res) => {

      console.log(
         " API Route Not Found:",
         req.method,
         req.originalUrl
      );

      res.status(404).json({

         success: false,

         message:
            "API Route Not Found",

         method:
            req.method,

         path:
            req.originalUrl

      });

   }
);


/* ==========================================
   ERROR HANDLER
========================================== */

app.use(
   (err, req, res, next) => {

      console.error(
         "Server Error:",
         err.stack
      );

      res.status(500).json({

         success: false,

         message:
            "Internal Server Error"

      });

   }
);


/* ==========================================
   SERVER
========================================== */

const PORT =
   process.env.PORT || 3000;

httpServer.listen(
   PORT,
   "0.0.0.0",
   () => {

      console.log(
         ` Server running on 0.0.0.0:${PORT}`
      );

   }
);