/* ==========================================
   KENYA SMART DIALER PRO
   AUTH CONTROLLER
========================================== */

"use strict";

const jwt = require("jsonwebtoken");

const User =
    require("../models/User");

const FinancialProfile =
    require("../models/FinancialProfile");


/* ==========================================
   LOGIN SECURITY
========================================== */

const MAX_LOGIN_ATTEMPTS = 5;

const LOCK_TIME =
    15 * 60 * 1000;


/* ==========================================
   GENERATE JWT
========================================== */

function generateToken(user) {

    return jwt.sign(

        {
            userId: user._id,
            role: user.role
        },

        process.env.JWT_SECRET,

        {
            expiresIn:
                process.env.JWT_EXPIRES || "7d"
        }

    );

}


/* ==========================================
   GENERATE ACCOUNT NUMBER
========================================== */

function generateAccountNumber(prefix) {

    const timestamp =
        Date.now().toString().slice(-8);

    const random =
        Math.floor(
            100 + Math.random() * 900
        );

    return `${prefix}${timestamp}${random}`;

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


        /* ======================================
           VALIDATION
        ====================================== */

        if (
            !fullName ||
            !email ||
            !phone ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "All fields are required."

            });

        }


        fullName =
            fullName.trim();

        email =
            email.trim().toLowerCase();

        phone =
            phone.trim();


        if (password.length < 8) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 8 characters."

            });

        }


        /* ======================================
           CHECK EXISTING EMAIL
        ====================================== */

        const emailExists =
            await User.findOne({
                email
            });

        if (emailExists) {

            return res.status(409).json({

                success: false,

                message:
                    "Email already registered."

            });

        }


        /* ======================================
           CHECK EXISTING PHONE
        ====================================== */

        const phoneExists =
            await User.findOne({
                phone
            });

        if (phoneExists) {

            return res.status(409).json({

                success: false,

                message:
                    "Phone number already registered."

            });

        }


        /* ======================================
           CREATE USER
        ====================================== */

        const user =
            await User.create({

                fullName,

                email,

                phone,

                password

            });


        /* ======================================
           GENERATE FINANCIAL ACCOUNT NUMBERS
        ====================================== */

        const kcbAccountNumber =
            generateAccountNumber("KCB");

        const equityAccountNumber =
            generateAccountNumber("EQT");

        const coopAccountNumber =
            generateAccountNumber("COOP");


        /* ======================================
           CREATE FINANCIAL PROFILE
        ====================================== */

        const financialProfile =
            await FinancialProfile.create({

                user: user._id,


                /* ------------------------------
                   WALLET
                ------------------------------ */

                wallet: {

                    balance: 0

                },


                /* ------------------------------
                   BANK ACCOUNTS
                ------------------------------ */

                banks: {

                    kcb: {

                        accountNumber:
                            kcbAccountNumber,

                        balance: 0

                    },

                    equity: {

                        accountNumber:
                            equityAccountNumber,

                        balance: 0

                    },

                    coop: {

                        accountNumber:
                            coopAccountNumber,

                        balance: 0

                    }

                },


                /* ------------------------------
                   AIRTIME
                ------------------------------ */

                airtime: {

                    safaricom: 0,

                    airtel: 0,

                    telkom: 0

                },


                /* ------------------------------
                   BUNDLES
                ------------------------------ */

                bundles: {

                    data: 0,

                    voice: 0,

                    sms: 0

                },


                /* ------------------------------
                   LOANS
                ------------------------------ */

                loans: {

                    outstanding: 0,

                    limit: 100000

                },


                /* ------------------------------
                   CARDS
                ------------------------------ */

                cards: {

                    active: true,

                    frozen: false

                },


                /* ------------------------------
                   SAVINGS
                ------------------------------ */

                savings: {

                    balance: 0

                }

            });


        console.log(
            "✅ Financial profile created:",
            user.email
        );


        /* ======================================
           GENERATE TOKEN
        ====================================== */

        const token =
            generateToken(user);


        /* ======================================
           REGISTRATION RESPONSE
        ====================================== */

        return res.status(201).json({

            success: true,

            message:
                "Account created successfully.",


            /* ------------------------------
               USER
            ------------------------------ */

            user: {

                id: user._id,

                fullName:
                    user.fullName,

                email:
                    user.email,

                phone:
                    user.phone,

                role:
                    user.role

            },


            /* ------------------------------
               FINANCIAL PROFILE
            ------------------------------ */

            financialProfile: {

                wallet:
                    financialProfile.wallet,

                banks:
                    financialProfile.banks,

                loans:
                    financialProfile.loans,

                cards:
                    financialProfile.cards,

                savings:
                    financialProfile.savings

            },


            /* ------------------------------
               TOKEN
            ------------------------------ */

            token

        });

    }

    catch (error) {

        console.error(
            "Registration Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Registration failed.",

            error:
                error.message

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

                message:
                    "Email and password are required."

            });

        }


        email =
            email.trim().toLowerCase();


        /* ======================================
           FIND USER
        ====================================== */

        const user =
            await User.findOne({
                email
            });


        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        /* ======================================
           ACCOUNT STATUS
        ====================================== */

        if (
            user.accountStatus ===
            "disabled"
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Account disabled. Contact support."

            });

        }


        if (
            user.lockUntil &&
            user.lockUntil > Date.now()
        ) {

            return res.status(423).json({

                success: false,

                message:
                    "Account temporarily locked. Try again later."

            });

        }


        /* ======================================
           VERIFY PASSWORD
        ====================================== */

        const passwordMatch =
            await user.comparePassword(
                password
            );


        if (!passwordMatch) {

            user.failedLoginAttempts += 1;


            if (
                user.failedLoginAttempts >=
                MAX_LOGIN_ATTEMPTS
            ) {

                user.lockUntil =
                    new Date(
                        Date.now() +
                        LOCK_TIME
                    );

                user.accountStatus =
                    "locked";

            }


            await user.save();


            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }


        /* ======================================
           RESET LOGIN SECURITY
        ====================================== */

        user.failedLoginAttempts = 0;

        user.lockUntil = null;

        user.accountStatus =
            "active";

        user.lastLogin =
            new Date();


        await user.save();


        /* ======================================
           LOAD FINANCIAL PROFILE
        ====================================== */

        const financialProfile =
            await FinancialProfile.findOne({

                user: user._id

            });


        /* ======================================
           GENERATE TOKEN
        ====================================== */

        const token =
            generateToken(user);


        /* ======================================
           LOGIN RESPONSE
        ====================================== */

        return res.status(200).json({

            success: true,

            message:
                "Login successful.",


            user: {

                id: user._id,

                fullName:
                    user.fullName,

                email:
                    user.email,

                phone:
                    user.phone,

                role:
                    user.role

            },


            financialProfile:
                financialProfile || null,


            token

        });

    }

    catch (error) {

        console.error(
            "Login Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Login failed.",

            error:
                error.message

        });

    }

};


/* ==========================================
   GET CURRENT USER
========================================== */

exports.getProfile = async (req, res) => {

    try {

        const user =
            await User.findById(
                req.user.userId
            );


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found."

            });

        }


        const financialProfile =
            await FinancialProfile.findOne({

                user:
                    req.user.userId

            });


        return res.status(200).json({

            success: true,

            user: {

                id: user._id,

                fullName:
                    user.fullName,

                email:
                    user.email,

                phone:
                    user.phone,

                role:
                    user.role

            },

            financialProfile:
                financialProfile || null

        });

    }

    catch (error) {

        console.error(
            "Get Profile Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to load profile.",

            error:
                error.message

        });

    }

};


/* ==========================================
   LOGOUT
========================================== */

exports.logout = async (req, res) => {

    return res.status(200).json({

        success: true,

        message:
            "Logged out successfully."

    });

};