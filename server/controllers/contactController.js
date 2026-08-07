/* ==========================================
   KENYA SMART DIALER PRO
   CONTACT CONTROLLER
========================================== */

"use strict";

const Contact = require("../models/Contact");

/* ==========================================
   GET CONTACTS
========================================== */

exports.getContacts = async (req, res) => {

    try {

        const contacts = await Contact.find({

            user: req.user.userId

        }).sort({

            name: 1

        });

        res.status(200).json({

            success: true,
            count: contacts.length,
            contacts

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Unable to load your contacts. Please try again."

        });

    }

};


/* ==========================================
   CREATE CONTACT
========================================== */

exports.createContact = async (req, res) => {

    try {

        const contact = await Contact.create({

            ...req.body,

            user: req.user.userId

        });

        res.status(201).json({

            success: true,
            message: "Contact saved successfully.",
            contact

        });

    }

    catch (error) {

        console.error(error);

        // Duplicate phone number
        if (error.code === 11000) {

            return res.status(400).json({

                success: false,
                message: "This phone number already exists in your contacts."

            });

        }

        // Validation errors
        if (error.name === "ValidationError") {

            return res.status(400).json({

                success: false,
                message: "Please fill in all required contact information."

            });

        }

        res.status(500).json({

            success: false,
            message: "Unable to save contact. Please try again."

        });

    }

};


/* ==========================================
   UPDATE CONTACT
========================================== */

exports.updateContact = async (req, res) => {

    try {

        const contact = await Contact.findOneAndUpdate(

            {

                _id: req.params.id,

                user: req.user.userId

            },

            req.body,

            {

                new: true,

                runValidators: true

            }

        );

        if (!contact) {

            return res.status(404).json({

                success: false,
                message: "Contact not found."

            });

        }

        res.json({

            success: true,
            message: "Contact updated successfully.",
            contact

        });

    }

    catch (error) {

        console.error(error);

        if (error.code === 11000) {

            return res.status(400).json({

                success: false,
                message: "Another contact already uses this phone number."

            });

        }

        res.status(500).json({

            success: false,
            message: "Unable to update contact."

        });

    }

};


/* ==========================================
   DELETE CONTACT
========================================== */

exports.deleteContact = async (req, res) => {

    try {

        const contact = await Contact.findOneAndDelete({

            _id: req.params.id,

            user: req.user.userId

        });

        if (!contact) {

            return res.status(404).json({

                success: false,
                message: "Contact not found."

            });

        }

        res.json({

            success: true,
            message: "Contact deleted successfully."

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Unable to delete contact."

        });

    }

};