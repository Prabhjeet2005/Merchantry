const {
	Schema,
	model,
	Types: { Decimal128 },
} = require("mongoose");
const { errorCreator } = require("../utils/responseCreator");

const productSchema = new Schema({
	id: { type: String },
	title: { type: String },
	price: { type: Decimal128 },
	description: { type: String },
	category: { type: String },
	thumbnail: { type: Array },
	rating: {
		type: Decimal128,
	},
	PaymentMethods: {
		type: [String],
	},
	discountPercentage: {
		type: Decimal128,
	},
	stock: {
		type: Number,
		default: 1,
	},
});

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: [true, "Username is Required"],
		},
		email: {
			type: String,
			required: [true, "Email is Required"],
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Password is Required"],
		},
		phone: {
			type: Number,
			unique: true,
			required: [true, "Phone is Required"],
			length: 10,
		},
		address: {
			address: { type: String, required: [true, "Address Required"] },
			city: { type: String, required: [true, "City Required"] },
			state: { type: String, required: [true, "State Required"] },
			country: { type: String, required: [true, "Country Required"] },
		},
		secret: { type: String },
		cart: {
			totalCount: { type: Number, default: 0 },
			totalValue: {
				type: Decimal128,
				set: (value) => new Decimal128(value.toFixed(2)),
				get: (value) => parseFloat(value),
				default: 0,
			},
			cart: {
				type: [Object],
			},
		},
		onBoarding: {
			status: {
				type: String,
				enum: ["Pending", "Rejected", "Approved"],
				required: function () {
					return this.role === "merchant";
				},
			},
			lastUpdatedDate: Date,
			requestDate: Date,
			statusUpdatedBy: {
				type: String,
			},
		},
		products: [productSchema],
		role: {
			type: String,
			default: "user",
			enum: ["user", "admin", "merchant"],
			required: [true, "Role Required"],
		},
		actions: {
			type: [Object],
		},
	},
	{ toObject: { getters: true }, timestamps: true }
);

// -------------------------- USER --------------------------
const sanitizedUserData = (userData) => {
	const { password, secret, _id, __v, ...dataToReturn } = userData;
	return dataToReturn;
};

userSchema.statics.createUser = async (userData) => {
	const { email } = userData;
	const existingUser = await UserModel.findOne({ email });
	if (existingUser) {
		errorCreator("User Already Exists!", 401);
	}
	const user = await UserModel.create(userData);
	if (!user) {
		errorCreator("Error Creating User", 401);
	}
	return sanitizedUserData(user?.toObject());
};

userSchema.statics.findUser = async (email) => {
	const user = await UserModel.findOne({ email });
	if (!user) {
		errorCreator("User Not Found", 404);
	}
	return user?.toObject();
};

userSchema.statics.updatedPassword = async (email, password) => {
	const updatedUser = await UserModel.findOneAndUpdate(
		{ email },
		{
			$set: { password },
		},
		{ new: true }
	);
	if (!updatedUser) {
		errorCreator("Error While Updating Password", 401);
	}
	return updatedUser?.toObject();
};

// -------------------------- Cart --------------------------

userSchema.statics.getCartItems = async (email) => {
	const userCart = await UserModel.findOne({ email }, { cart: 1 });
	if (!userCart) {
		errorCreator("Error Displaying Cart", 401);
	}
	return userCart?.toObject();
};

userSchema.statics.addToCart = async (email, product) => {
	const existingProductInCart = (
		await UserModel.findOne({ email, "cart.cart.id": product.id })
	)?.toObject();
	if (existingProductInCart) {
		return await UserModel.increment(email, product);
	}
	const { cart } = await UserModel.findOneAndUpdate(
		{ email },
		{
			$push: { "cart.cart": { ...product, quantity: 1 } },
			$inc: { "cart.totalCount": 1, "cart.totalValue": product.price },
		},
		{ new: true }
	);
	if (!cart) {
		errorCreator("Error Adding Product To Cart", 400);
	}
	return cart?.toObject();
};

userSchema.statics.increment = async (email, product) => {
	const exisitingProductInCart = (
		await UserModel.findOne({ email, "cart.cart.id": product.id })
	)?.toObject();
	if (!exisitingProductInCart) {
		return await UserModel.addToCart(email, product);
	}

	const userData = (
		await UserModel.findOneAndUpdate(
			{ email, "cart.cart.id": product.id },
			{
				$inc: {
					"cart.cart.$.quantity": 1,
					"cart.totalCount": 1,
					"cart.totalValue": product.price,
				},
			},
			{ new: true }
		)
	)?.toObject();
	if (!userData) {
		errorCreator("Error Incrementing", 400);
	}
	return userData.cart;
};

userSchema.statics.decrement = async (email, product) => {
	const exisitingProductInCart = (
		await UserModel.findOne({ email, "cart.cart.id": product.id })
	)?.toObject();
	if (!exisitingProductInCart) {
		errorCreator("Product Not Found In Cart", 404);
	}
	const { quantity } = exisitingProductInCart.cart.cart.find(
		({ id }) => id === product.id
	);

	if (quantity === 1) {
		return await UserModel.removeProduct(email, product);
	}

	const decrementProductFromCart = (
		await UserModel.findOneAndUpdate(
			{ email, "cart.cart.id": product.id },
			{
				$inc: {
					"cart.totalCount": -1,
					"cart.totalValue": -product.price,
					"cart.cart.$.quantity": -1,
				},
			},
			{ new: true }
		)
	)?.toObject();

	if (!decrementProductFromCart) {
		errorCreator("Error Decrementing");
	}
	return decrementProductFromCart.cart;
};

userSchema.statics.removeProduct = async (email, product) => {
	const existingProductInCart = (
		await UserModel.findOne({ email, "cart.cart.id": product.id })
	)?.toObject();
	if (!existingProductInCart) {
		errorCreator("Product Not Found In Cart", 404);
	}

	const { quantity } = existingProductInCart.cart.cart.find(
		({ id }) => id === product.id
	);
	console.log("QTY:", quantity);
	const removedProductFromCart = (
		await UserModel.findOneAndUpdate(
			{ email },
			{
				$pull: { "cart.cart": { id: product.id } },
				$inc: {
					"cart.totalCount": -quantity,
					"cart.totalValue": -quantity * product.price,
				},
			},
			{ new: true }
		)
	)?.toObject();
	if (!removedProductFromCart) {
		errorCreator("Error Removing Product", 400);
	}
	return removedProductFromCart.cart;
};

userSchema.statics.clearCart = async (email) => {
	const { cart } = await UserModel.findOneAndUpdate(
		{ email },
		{
			$set: {
				"cart.cart": [],
				"cart.totalCount": 0,
				"cart.totalValue": 0,
			},
		},
		{ new: true }
	);
	if (!cart) {
		errorCreator("Error Clearing Cart");
	}
	return cart;
};

// -------------------------- MERCHANT --------------------------

// -------------------------- ADMIN --------------------------

userSchema.statics.getAllMerchants = async () => {
	const merchantData = await UserModel.find({ role: "merchant" },{projection:{products:0}});
	return merchantData;
};

userSchema.statics.onBoardingStatus = async (
	adminEmail,
	merchantEmail,
	action
) => {
	const merchantOnBoardingUpdate = await UserModel.findOneAndUpdate(
		{ email: merchantEmail },
		{
			$set: { onBoarding: { status: action,statusUpdatedBy:adminEmail } },
		},
		{new:true}
	);
	if(!merchantOnBoardingUpdate){
		errorCreator("Unable To Update Merchant Status")
	}
	const payload = {merchantEmail,adminEmail,action}

	const adminUpdationAction = (await UserModel.findOneAndUpdate(
		{email:adminEmail},
		{$push:{actions:payload}},
		{new:true}
	))?.toObject();

	if(!adminUpdationAction){
		errorCreator("Unable To Update Action Of Admin",400)
	}
	return merchantOnBoardingUpdate?.toObject()

};

const UserModel = model("users", userSchema);
module.exports = UserModel;
