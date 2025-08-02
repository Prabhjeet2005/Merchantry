require("dotenv").config()
require("./utils/dbConnection")
const express = require('express')
const cors = require('cors')
const cookieParser = require("cookie-parser")
const userRouter = require("./routes/user.route")
const errorHandler = require("./utils/errorHandler")
const cartRouter = require("./routes/cart.route")
const merchantRouter = require("./routes/merchant.route")
const productRouter = require("./routes/product.route")
const adminRouter = require("./routes/admin.route")

const app = express()

app.use(
	cors({
		origin: process.env.CLIENT_URL,
    credentials: true,
	})
);
app.use(express.json())
app.use(cookieParser())

app.use("/api/users",userRouter)
app.use("/api/carts",cartRouter)
app.use("/api/merchants",merchantRouter)
app.use("/api/admin",adminRouter)
app.use("/api/products",productRouter)


app.use(errorHandler)

const PORT = process.env.PORT || 8080
app.listen(PORT,()=>{
	console.clear()
  console.log(`Server Running on ${PORT}`);
})