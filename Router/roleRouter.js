const express = require("express");
const router = express.Router();
const { createRole, getRole } = require("../Controllers/roleController");

router.post("/role", createRole); // Create Role

router.get("/role/:page?", getRole); //Get All created Role

module.exports = router;
