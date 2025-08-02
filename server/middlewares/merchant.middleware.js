const UserModel = require("../models/user.model");
const { verifyToken } = require("../utils/jwtUtil");
const { errorCreator } = require("../utils/responseCreator");

const merchantMiddleware = async (req, res, next) => {
	try {
		const {email} = req.body;
		console.log(email)
		const merchant = await UserModel.findUser(email);
		console.log(merchant.role,merchant.onBoarding.status)

		if (
			merchant.role === "merchant" &&
			merchant.onBoarding.status === "Approved"
		) {
			res.locals.merchant = merchant;
			next();
		} else {
			errorCreator("Merchant Not Authorized", 403);
		}
	} catch (error) {
		next(error);
	}
};

module.exports = merchantMiddleware;
