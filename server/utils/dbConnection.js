const mongoose = require("mongoose");

mongoose
	.connect(process.env.MONGODB_URL)
	.then(() => console.log("DB CONNECTED!!"))
	.catch((err) => console.log("Error Connecting DB", err));
