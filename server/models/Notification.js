"use strict";

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

    bank: {

        type: String,

        required: true

    },

    accountNumber: {

        type: String,

        required: true

    },

    title: {

        type: String,

        required: true

    },

    message: {

        type: String,

        required: true

    },

    type: {

        type: String,

        default: "INFO"

    },

    read: {

        type: Boolean,

        default: false

    },

    createdAt: {

        type: Date,

        default: Date.now

    }

});

module.exports = mongoose.model(

    "Notification",

    notificationSchema

);