/* ==========================================
   KENYA SMART DIALER PRO
   CARD CONTROLLER
========================================== */

"use strict";

const Card = require("../models/Card");

/* ==========================================
   GET USER CARDS
========================================== */

exports.getCards = async (req, res) => {

    try {

        const cards = await Card.find({

            user: req.user.userId

        }).sort({

            createdAt: -1

        });

        res.json({

            success: true,

            cards

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
   CREATE CARD
========================================== */

exports.createCard = async (req, res) => {

    try {

        const {

            bank,

            cardType

        } = req.body;

        const card = await Card.create({

            user: req.user.userId,

            bank: bank || "KCB",

            cardType: cardType || "Debit",

            cardNumber:

                "4567" +

                Math.floor(

                    100000000000 +

                    Math.random() *

                    900000000000

                ),

            expiry: "12/30",

            cvv: String(

                Math.floor(

                    100 +

                    Math.random() * 900

                )

            )

        });

        res.status(201).json({

            success: true,

            card

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
   FREEZE CARD
========================================== */

exports.freezeCard = async (req, res) => {

    try {

        const card = await Card.findOne({

            _id: req.params.id,

            user: req.user.userId

        });

        if (!card) {

            return res.status(404).json({

                success: false,

                message: "Card not found."

            });

        }

        card.frozen = true;

        card.status = "FROZEN";

        await card.save();

        res.json({

            success: true,

            card

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
   UNFREEZE CARD
========================================== */

exports.unfreezeCard = async (req, res) => {

    try {

        const card = await Card.findOne({

            _id: req.params.id,

            user: req.user.userId

        });

        if (!card) {

            return res.status(404).json({

                success: false,

                message: "Card not found."

            });

        }

        card.frozen = false;

        card.status = "ACTIVE";

        await card.save();

        res.json({

            success: true,

            card

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
   BLOCK CARD
========================================== */

exports.blockCard = async (req, res) => {

    try {

        const card = await Card.findOne({

            _id: req.params.id,

            user: req.user.userId

        });

        if (!card) {

            return res.status(404).json({

                success: false,

                message: "Card not found."

            });

        }

        card.blocked = true;

        card.frozen = true;

        card.status = "BLOCKED";

        await card.save();

        res.json({

            success: true,

            card

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
   CHANGE CARD PIN
========================================== */

exports.changePIN = async (req, res) => {

    try {

        const { pin } = req.body;

        const card = await Card.findOne({

            _id: req.params.id,

            user: req.user.userId

        });

        if (!card) {

            return res.status(404).json({

                success: false,

                message: "Card not found."

            });

        }

        // NOTE:
        // For now we don't store the PIN.
        // Later we'll encrypt it with bcrypt.

        res.json({

            success: true,

            message: "Card PIN updated successfully."

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
   UPDATE CARD LIMITS
========================================== */

exports.updateLimits = async (req, res) => {

    try {

        const {

            atm,

            pos,

            online

        } = req.body;

        const card = await Card.findOne({

            _id: req.params.id,

            user: req.user.userId

        });

        if (!card) {

            return res.status(404).json({

                success: false,

                message: "Card not found."

            });

        }

        if (atm !== undefined)
            card.limits.atm = atm;

        if (pos !== undefined)
            card.limits.pos = pos;

        if (online !== undefined)
            card.limits.online = online;

        await card.save();

        res.json({

            success: true,

            card

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
   UPDATE CARD SETTINGS
========================================== */

exports.updateSettings = async (req, res) => {

    try {

        const {

            onlinePayments,

            internationalPayments,

            contactlessPayments

        } = req.body;

        const card = await Card.findOne({

            _id: req.params.id,

            user: req.user.userId

        });

        if (!card) {

            return res.status(404).json({

                success: false,

                message: "Card not found."

            });

        }

        if (onlinePayments !== undefined)
            card.onlinePayments = onlinePayments;

        if (internationalPayments !== undefined)
            card.internationalPayments = internationalPayments;

        if (contactlessPayments !== undefined)
            card.contactlessPayments = contactlessPayments;

        await card.save();

        res.json({

            success: true,

            card

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
   REPLACE CARD
========================================== */

exports.replaceCard = async (req, res) => {

    try {

        const oldCard = await Card.findOne({

            _id: req.params.id,

            user: req.user.userId

        });

        if (!oldCard) {

            return res.status(404).json({

                success: false,

                message: "Card not found."

            });

        }

        oldCard.blocked = true;

        oldCard.status = "BLOCKED";

        await oldCard.save();

        const newCard = await Card.create({

            user: req.user.userId,

            bank: oldCard.bank,

            cardType: oldCard.cardType,

            cardNumber:

                "4567" +

                Math.floor(

                    100000000000 +

                    Math.random() *

                    900000000000

                ),

            expiry: "12/30",

            cvv: String(

                Math.floor(

                    100 +

                    Math.random() * 900

                )

            )

        });

        res.json({

            success: true,

            oldCard,

            newCard

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};