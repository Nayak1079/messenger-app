const express = require("express");
const validateForm = require("../controllers/validateForm");
const router = express.Router();
const {handleLogin, attemptLogin, attemptRegister}=require("../controllers/authController")
const { rateLimiter } = require("../controllers/rateLimitter");
// Rate Limiting Middleware
// Login Route
router.
route("/login")
  .get(handleLogin)
    .post(validateForm,rateLimiter(60,10),attemptLogin);

// Signup Route
router.post("/signup",validateForm, 
attemptRegister);
module.exports = router;
