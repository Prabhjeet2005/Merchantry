const UserModel = require("../models/user.model");
const { verifyToken } = require("../utils/jwtUtil");
const { errorCreator } = require("../utils/responseCreator");

const authMiddleware = async (req, res, next) => {
	try {
		const { authToken } = req.cookies;
		if (!authToken) {
			errorCreator("Token Missing", 401);
		}
		const data = verifyToken(authToken);
		if (!data) {
			errorCreator("Invalid Token Credentials", 401);
		}
		const { email, role } = data;
		const { secret, password, ...user } = await UserModel.findUser(email);
		res.locals.user = user;
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = authMiddleware;
