const express = require("express");
const router = express.Router();
const tokenVerify = require("../middelware/tokenVerify");
require("dotenv").config();
const { signup, signin, me } = require("../Controllers/userController");

router.post("/signup", signup); //Create Account

router.post("/signin", signin); //Login route

router.get("/me", tokenVerify, me); //Get my profile info

module.exports = router;
