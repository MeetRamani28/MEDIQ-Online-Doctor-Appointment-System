const express = require("express");
const router = express.Router();
const { submitContact, getAllContacts } = require("../controllers/contactController");
const authMiddleware = require("../middlewares/authMiddlewares");

router.post("/", submitContact);
router.get("/", authMiddleware("ADMIN"), getAllContacts);

module.exports = router;
