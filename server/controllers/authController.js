/* ==========================================
   KENYA SMART DIALER PRO
   AUTH CONTROLLER
========================================== */

"use strict";

const jwt = require("jsonwebtoken");

const User = require("../models/User");
const FinancialProfile = require("../models/FinancialProfile");

/* ==========================================
   HELPERS
========================================== */

const MAX_LOGIN_ATTEMPTS = 5;

const LOCK_TIME = 15 * 60 * 1000; // 15 Minutes

function generateToken(user) {

    return jwt.sign(

        {

            userId: user._id,

            role: user.role

        },

        process.env.JWT_SECRET,

        {

            expiresIn: process.env.JWT_EXPIRES || "7d"

        }

    );

}

/* ==========================================
   REGISTER
========================================== */

exports.register = async (req, res) => {

    try {

        let {

            fullName,

            email,

            phone,

            password

        } = req.body;

        /* -------------------------
           Validation
        ------------------------- */

        if (

            !fullName ||

            !email ||

            !phone ||

            !password

        ) {

            return res.status(400).json({

                success: false,

                message: "All fields are required."

            });

        }

        fullName = fullName.trim();

        email = email.trim().toLowerCase();

        phone = phone.trim();

        if (password.length < 8) {

            return res.status(400).json({

                success: false,

                message: "Password must be at least 8 characters."

            });

        }

        /* -------------------------
           Existing User
        ------------------------- */

        const emailExists = await User.findOne({

            email

        });

        if (emailExists) {

            return res.status(409).json({

                success: false,

                message: "Email already registered."

            });

        }

        const phoneExists = await User.findOne({

            phone

        });

        if (phoneExists) {

            return res.status(409).json({

                success: false,

                message: "Phone number already registered."

            });

        }

        /* -------------------------
           Create User
        ------------------------- */

        const user = await User.create({

            fullName,

            email,

            phone,

            password

        });

        /* -------------------------
           Create Financial Profile
        ------------------------- */

        await FinancialProfile.create({

            user: user._id,

            wallet: {

                balance: 0

            },

            banks: {

                kcb: {

                    accountNumber: "KCB" + Date.now(),

                    balance: 0

                },

                equity: {

                    accountNumber: "EQT" + Date.now(),

                    balance: 0

                },

                coop: {

                    accountNumber: "COOP" + Date.now(),

                    balance: 0

                }

            },

            airtime: {

                safaricom: 0,

                airtel: 0,

                telkom: 0

            },

            bundles: {

                data: 0,

                voice: 0,

                sms: 0

            }

        });

        console.log("✅ Financial profile created:", user.email);

        return res.status(201).json({

            success: true,

            message: "Account created successfully.",

            user,

            token: generateToken(user)

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Registration failed.",

            error: error.message

        });

    }

};
/* ==========================================
   LOGIN
========================================== */

exports.login = async (req, res) => {

    try {

        let {

            email,

            password

        } = req.body;

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "Email and password are required."

            });

        }

        email = email.trim().toLowerCase();

        /* -------------------------
           Find User
        ------------------------- */

        const user = await User.findOne({

            email

        });

        console.log("User Found:", user);

        if (!user) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password."

            });

        }

        /* -------------------------
           Account Status
        ------------------------- */

        if (user.accountStatus === "disabled") {

            return res.status(403).json({

                success: false,

                message: "Account disabled. Contact support."

            });

        }

        if (user.lockUntil && user.lockUntil > Date.now()) {

            return res.status(423).json({

                success: false,

                message: "Account temporarily locked. Try again later."

            });

        }

        /* -------------------------
           Verify Password
        ------------------------- */


        console.log("Email entered:", email);
        console.log("Password entered:", password);

        const passwordMatch = await user.comparePassword(password);

        console.log("Password Match:", passwordMatch);

        if (!passwordMatch) {
            user.failedLoginAttempts += 1;

            if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {

                user.lockUntil = new Date(

                    Date.now() + LOCK_TIME

                );

                user.accountStatus = "locked";

            }

            await user.save();

            return res.status(401).json({

                success: false,

                message: "Invalid email or password."

            });

        }

        /* -------------------------
           Reset Login Attempts
        ------------------------- */

        user.failedLoginAttempts = 0;

        user.lockUntil = null;

        user.accountStatus = "active";

        user.lastLogin = new Date();

        await user.save();

        /* -------------------------
           Generate Token
        ------------------------- */

        const token = generateToken(user);

        return res.status(200).json({

            success: true,

            message: "Login successful.",

            token,

            user

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Login failed.",

            error: error.message

        });

    }

};

/* ==========================================
   GET CURRENT USER
========================================== */

exports.getProfile = async (req, res) => {

    try {

        const user = await User.findById(

            req.user.userId

        );

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        return res.json({

            success: true,

            user

        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

/* ==========================================
   LOGOUT
========================================== */

exports.logout = async (req, res) => {

    return res.json({

        success: true,

        message: "Logged out successfully."

    });

};