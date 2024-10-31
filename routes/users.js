const express = require('express');
const authMiddleware = require("../middlewares/AuthMiddleware");
const authController = require("../controllers/authController");
const verifySignup = require("../middlewares/verifySignup");
const userController = require("../controllers/UserController");

const router = express.Router();

router.get("/all", userController.allAccess)
router.get("/", userController.userBoard)

router.get("/admin_board", [authMiddleware.verifyToken, authMiddleware.checkAdmin], userController.adminBoard)

module.exports = router;
