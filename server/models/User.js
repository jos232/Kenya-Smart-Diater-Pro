/* ==========================================
   KENYA SMART DIALER PRO
   USER MODEL
========================================== */

"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/* ==========================================
   USER SCHEMA
========================================== */

const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 8
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    accountStatus: {
        type: String,
        enum: ["active", "locked", "disabled"],
        default: "active"
    },

    emailVerified: {
        type: Boolean,
        default: false
    },

    failedLoginAttempts: {
        type: Number,
        default: 0
    },

    lockUntil: {
        type: Date,
        default: null
    },

    lastLogin: {
        type: Date,
        default: null
    }

}, {

    timestamps: true

});



/* ==========================================
   HASH PASSWORD
========================================== */

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {

        return next();

    }

    try {

        const salt = await bcrypt.genSalt(12);

        this.password = await bcrypt.hash(this.password, salt);

        next();

    }

    catch (error) {

        next(error);

    }

});

/* ==========================================
   COMPARE PASSWORD
========================================== */

userSchema.methods.comparePassword = async function (password) {

    return await bcrypt.compare(password, this.password);

};

/* ==========================================
   ACCOUNT LOCK STATUS
========================================== */

userSchema.virtual("isLocked").get(function () {

    return !!(

        this.lockUntil &&

        this.lockUntil > Date.now()

    );

});

/* ==========================================
   HIDE SENSITIVE DATA
========================================== */

userSchema.set("toJSON", {

    transform: (doc, ret) => {

        delete ret.password;
        delete ret.__v;

        return ret;

    }

});

/* ==========================================
   EXPORT MODEL
========================================== */

module.exports = mongoose.model("User", userSchema);