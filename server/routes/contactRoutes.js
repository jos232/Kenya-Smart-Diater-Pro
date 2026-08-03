const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {

    getContacts,
    createContact,
    updateContact,
    deleteContact

} = require("../controllers/contactController");

/* ==========================
   Contact Routes
========================== */

router.get("/", auth, getContacts);

router.post("/", auth, createContact);

router.put("/:id", auth, updateContact);

router.delete("/:id", auth, deleteContact);

module.exports = router;