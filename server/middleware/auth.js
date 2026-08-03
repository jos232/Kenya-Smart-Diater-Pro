/* ==========================================
   KENYA SMART DIALER PRO
   AUTH MIDDLEWARE
========================================== */

"use strict";

const jwt = require("jsonwebtoken");

/* ==========================================
   VERIFY TOKEN
========================================== */

module.exports = (req, res, next) => {

    try {

        console.log("\n========== AUTH MIDDLEWARE ==========");
        console.log("Request:", req.method, req.originalUrl);

        /* -------------------------
           Check Authorization Header
        ------------------------- */

        const authHeader = req.headers.authorization;

        console.log("Authorization Header:", authHeader);

        if (!authHeader) {

            return res.status(401).json({
                success: false,
                message: "Authorization header missing."
            });

        }

        if (!authHeader.startsWith("Bearer ")) {

            return res.status(401).json({
                success: false,
                message: "Bearer token missing."
            });

        }

        /* -------------------------
           Extract Token
        ------------------------- */

        const token = authHeader.split(" ")[1];

        console.log("Received Token:", token);

        if (!token) {

            return res.status(401).json({
                success: false,
                message: "Authentication token missing."
            });

        }

        /* -------------------------
           Check JWT Secret
        ------------------------- */

        console.log("JWT Secret:", process.env.JWT_SECRET);

        if (!process.env.JWT_SECRET) {

            return res.status(500).json({
                success: false,
                message: "JWT_SECRET is not loaded."
            });

        }

        /* -------------------------
           Verify Token
        ------------------------- */

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("Decoded JWT:", decoded);

        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };

        console.log("Authenticated User:", req.user);
        console.log("=====================================\n");

        next();

    }

    catch (error) {

        console.error("\n========== JWT ERROR ==========");
        console.error(error);
        console.error("===============================\n");

        if (error.name === "TokenExpiredError") {

            return res.status(401).json({
                success: false,
                message: "Session expired. Please login again."
            });

        }

        if (error.name === "JsonWebTokenError") {

            return res.status(401).json({
                success: false,
                message: "Invalid authentication token."
            });

        }

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};