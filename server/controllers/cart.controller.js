const UserModel = require("../models/user.model");
const { responseCreator } = require("../utils/responseCreator");

const getCartItemsController = async (req, res, next) => {
	try {
		const { email } = res.locals.user;
		const cart = await UserModel.getCartItems(email);
		res
			.status(200)
			.send(responseCreator("Fetched Cart Items Successfully!", cart));
	} catch (error) {
		next(error);
	}
};
const addToCartController = async (req, res, next) => {
	try {
		const { email } = res.locals.user;
		const product = req.body;
		const cart = await UserModel.addToCart(email, product);

		res.status(201).send(responseCreator("Added To Cart Successfully!", cart));
	} catch (error) {
		next(error);
	}
};
const incrementController = async (req, res, next) => {
	try {
		const { email } = res.locals.user;
		const  product  = req.body;
		const cart = await UserModel.increment(email, product);

		res
			.status(200)
			.send(responseCreator("Incremented Product Successfully!", cart));
	} catch (error) {
		next(error);
	}
};
const decrementController = async (req, res, next) => {
	try {
		const { email } = res.locals.user;
		const  product  = req.body;
		const cart = await UserModel.decrement(email, product);

		res
			.status(200)
			.send(responseCreator("Decremented Product Successfully!", cart));
	} catch (error) {
		next(error);
	}
};
const removeProductController = async (req, res, next) => {
	try {
		const { email } = res.locals.user;
		const  product  = req.body;
		const cart = await UserModel.removeProduct(email, product);

		res
			.status(200)
			.send(responseCreator("Removed From Cart Successfully!", cart));
	} catch (error) {
		next(error);
	}
};
const clearCartController = async (req, res, next) => {
	try {
		const { email } = res.locals.user;
		const cart = await UserModel.clearCart(email);

		res.status(200).send(responseCreator("Cleared Cart Successfully!", cart));
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getCartItemsController,
	addToCartController,
	incrementController,
	decrementController,
	removeProductController,
	clearCartController,
};
