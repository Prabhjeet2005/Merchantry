const express = require("express")
const {
	signupController,
	loginController,
	loginWithTokenController,
	logoutController,
	resetPasswordController,
  getAllMerchantsController,
  onBoardingStatusController,
} = require("../controllers/admin.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const adminRouter = express.Router()

adminRouter.post("/signup", signupController);
adminRouter.post("/login", loginController);
adminRouter.get("/loginWithToken", loginWithTokenController);
adminRouter.get("/logout",authMiddleware, logoutController);
adminRouter.patch("/resetPassword", resetPasswordController);
adminRouter.patch("/onBoardingStatus",authMiddleware,adminMiddleware, onBoardingStatusController);
adminRouter.get("/getAllMerchants", authMiddleware,adminMiddleware,getAllMerchantsController);


module.exports = adminRouter