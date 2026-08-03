/* ==========================================
   KENYA SMART DIALER PRO
   AUTH ROUTES
========================================== */

"use strict";

const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const auth = require("../middleware/auth");

/* ==========================================
   PUBLIC ROUTES
========================================== */

router.post("/register", authController.register);

router.post("/login", authController.login);

/* ==========================================
   PROTECTED ROUTES
========================================== */

router.get("/profile", auth, authController.getProfile);

router.post("/logout", auth, authController.logout);

/* ==========================================
   EXPORT
========================================== */

module.exports = router;