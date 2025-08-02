const express = require("express");
const {
	signupController,
	loginController,
	loginWithTokenController,
	logoutController,
	resetPasswordController,
} = require("../controllers/merchant.controller");
const merchantMiddleware = require("../middlewares/merchant.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const merchantRouter = express.Router();

merchantRouter.post("/signup", signupController);
merchantRouter.post("/login",merchantMiddleware, loginController);
merchantRouter.get("/loginWithToken",merchantMiddleware, loginWithTokenController);
merchantRouter.get("/logout",authMiddleware, logoutController);
merchantRouter.patch("/resetPassword",merchantMiddleware, resetPasswordController);

module.exports = merchantRouter;
