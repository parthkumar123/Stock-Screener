"use strict";
// Purpose: Handle all routes related to login.
const express = require("express");
const router = express.Router();

const {
    getStockList,
} = require("../controllers/index");

router.route("/")
    .get(getStockList);

module.exports = router;