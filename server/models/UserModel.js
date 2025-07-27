const {
	Schema,
	model,
	Types: { Decimal128 },
} = require("mongoose");

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
			required: [true, "Phone is Required"],
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
				default: Decimal128.fromString("0.00"),
			},
			cart: {
				type: [Object],
			},
		},
		onBoarding: {
			status: {
				type: String,
				enum: ["Pending", "Rejected", "Accepted"],
				default: "Pending",
			},
			lastUpdatedDate: Date,
			requestDate: Date,
			statusUpdatedBy: String,
		},
		products: [productSchema],
    role:{
      type:String,
      default:"user",
      enum:["user","admin","merchant"],
      required:[true,"Role Required"]
    }
	},
	{ toObject: { getters: true } ,timestamps: true},
);

const UserModel = model("users", userSchema);
module.exports = UserModel;
