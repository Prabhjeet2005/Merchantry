const UserModel = require("../models/user.model");
const { generateToken, verifyToken } = require("../utils/jwtUtil");
const {
	generatePassword,
	verifyPassword,
} = require("../utils/passwordHandler");
const { responseCreator, errorCreator } = require("../utils/responseCreator");
const { generateQRCode, verifyQRcode } = require("../utils/tempOTP");

const signupController = async (req, res, next) => {
	try {
		const userData = req.body;
		const { email, password: userPwd } = userData;
		const hashedPwd = await generatePassword(userPwd);
		// QRcode is image link for QR Code , store in client to use for reset password
		const { QRcode, secret } = await generateQRCode(email);
		const updatedUserData = {
			...userData,
			password: hashedPwd,
			secret,
		};
		const user = await UserModel.createUser(updatedUserData);

		res
			.status(201)
			.send(
				responseCreator("Admin Signned Up Successfully", QRcode)
			);
	} catch (error) {
		next(error);
	}
};
const loginController = async (req, res, next) => {
	try {
		const userData = req.body;
		const { email, password: userPassword } = userData;
		const {
			password: hashedPwd,
			role,
			...data
		} = await UserModel.findUser(email);
		const isPasswordValid = await verifyPassword(userPassword, hashedPwd);
		if (!isPasswordValid) {
			errorCreator("Invalid Credentials", 401);
		}

		const token = generateToken(email, role);
		res.cookie("authToken", token, {
			maxAge: 60 * 60 * 24 * 1000,
			httpOnly: true,
		});
		res
			.status(200)
			.send(responseCreator("Admin Logged In Successfully!", data));
	} catch (error) {
		next(error);
	}
};
const loginWithTokenController = async (req, res, next) => {
	try {
		const { authToken } = req.cookies;
		const token = verifyToken(authToken);
		if (!token) {
			errorCreator("Invalid Token", 401);
		}
		const { email } = token;
		const user = await UserModel.findUser(email);
		res
			.status(200)
			.send(
				responseCreator("Admin Logged In With Token Successfully!", user)
			);
	} catch (error) {
		next(error);
	}
};
const logoutController = async (req, res, next) => {
	try {
		const { authToken } = req.cookies;
		if (!authToken) {
			errorCreator("Already Logged Out!");
		}
		res.clearCookie("authToken");
		res.send(responseCreator("Admin Logged Out Successfully"));
	} catch (error) {
		next(error);
	}
};
const resetPasswordController = async (req, res, next) => {
	try {
		const { email, password, otp } = req.body;
		const { secret } = await UserModel.findUser(email);
		const isOTPValid = verifyQRcode(secret, otp);
		if (!isOTPValid) {
			errorCreator("OTP Invalid", 400);
		}
		const hashedPwd = await generatePassword(password);
		const updatedUser = await UserModel.updatedPassword(email, hashedPwd);
		res
			.status(203)
			.send(responseCreator("Password Updated Successfully!", updatedUser));
	} catch (error) {
		next(error);
	}
};

const onBoardingStatusController = async(req,res,next)=>{
  try {
    const {email:adminEmail} = res.locals.admin;
    const {email:merchantEmail,action} = req.body;
    const data = await UserModel.onBoardingStatus(adminEmail,merchantEmail,action);
    res.send(responseCreator(`Merchant Status Set To ${data.onBoarding.status}`,data));
  } catch (error) {
    next(error)
  }
}
const getAllMerchantsController = async (req, res, next) => {
	try {
    const allMerchants = await UserModel.getAllMerchants();
    console.log(allMerchants)
    res.status(200).send(responseCreator("Succefully Fetched All Merchants",allMerchants))
	} catch (error) {
		next(error);
	}
};

module.exports = {
	signupController,
	loginController,
	loginWithTokenController,
	resetPasswordController,
	logoutController,
  onBoardingStatusController,
  getAllMerchantsController
};
