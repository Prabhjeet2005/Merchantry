const express = require('express');
const { signupController, loginController, loginWithTokenController, logoutController, resetPasswordController } = require('../controllers/user.controller');

const userRouter = express.Router()

userRouter.post("/signup",signupController)
userRouter.post("/login",loginController)
userRouter.get("/loginWithToken", loginWithTokenController);
userRouter.get("/logout",logoutController)
userRouter.patch("/resetPassword", resetPasswordController);

module.exports = userRouter;