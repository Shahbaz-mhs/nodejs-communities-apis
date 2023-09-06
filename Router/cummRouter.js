const express = require("express");
const router = express.Router();
const tokenVerify = require("../middelware/tokenVerify");
const {
  createCummunity,
  getAllCummunity,
  addUsertoCummunity,
  dltCummunityMember,
  getAllCummunityMem,
  getMyCummunity,
  getMyjoinedCummunity,
} = require("../Controllers/cummController");

router.post("/community", tokenVerify, createCummunity); //create cummunity

router.get("/community/:page?", tokenVerify, getAllCummunity); //Get All Creatd Cummunity

router.post("/member", tokenVerify, addUsertoCummunity); //Add User to created Cummunity

router.delete("/member/:id", tokenVerify, dltCummunityMember); //Delete user from cummunity

router.get("/community/:id/members/:page?", tokenVerify, getAllCummunityMem); //Get All cummunity members

router.get("/community/me/owner", tokenVerify, getMyCummunity); //Get my owned Cummunity

router.get("/community/me/member", tokenVerify, getMyjoinedCummunity); //Get my joined cummunity

module.exports = router;
