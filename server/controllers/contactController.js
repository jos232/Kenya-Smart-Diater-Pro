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

        res.status(500).json({

            success: false,

            message: error.message

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

            contact

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

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

            contact

        });

    }

    catch (error) {

        res.status(400).json({

            success: false,

            message: error.message

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

        res.status(400).json({

            success: false,

            message: error.message

        });

    }

};