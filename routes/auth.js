const express = require("express");
const authMiddleware = require("../middlewares/AuthMiddleware");
const authController = require("../controllers/authController");
const verifySignup = require("../middlewares/verifySignup");
const userController = require("../controllers/UserController");

const router = express.Router();

router.post("/signup", [verifySignup.checkDuplicateEmail, verifySignup.checkRoleExists], authController.signup);

router.post("/signing", authController.signIn)


module.exports = router;
