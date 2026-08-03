/* ==========================================
   BUNDLE ROUTES
========================================== */

"use strict";

const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {

    buyBundle,

    getHistory

} = require("../controllers/bundleController");

router.post("/", auth, buyBundle);

router.get("/", auth, getHistory);

module.exports = router;