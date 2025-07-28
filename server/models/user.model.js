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
	image: { type: String },
	rating: {
		rate: Number,
		count: Number,
	},
	PaymentMethods: {
		type: [String],
	},
	discountedPrice: {
		type: Decimal128,
	},
	quantity:{
		type:Number,
		default:1
	}
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
				enum: ["Pending", "Rejected", "Accepted"],
				required: function () {
					return this.role === "merchant";
				},
			},
			lastUpdatedDate: Date,
			requestDate: Date,
			statusUpdatedBy: {
				type: String,
				required: function () {
					return this.role === "merchant";
				},
			},
		},
		products: [productSchema],
		role: {
			type: String,
			default: "user",
			enum: ["user", "admin", "merchant"],
			required: [true, "Role Required"],
		},
	},
	{ toObject: { getters: true }, timestamps: true }
);

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
	if(!updatedUser){
		errorCreator("Error While Updating Password",401)
	}
	return updatedUser?.toObject();
};

const UserModel = model("users", userSchema);
module.exports = UserModel;
