require("dotenv").config()
require("./utils/dbConnection")
const express = require('express')
const cors = require('cors')

const app = express()

app.use(
	cors({
		origin: process.env.CLIENT_URL,
    credentials: true,
	})
);

app.use("/api/users",userRouter)

const PORT = process.env.PORT
app.listen(PORT,()=>{
  console.log(`Server Running on ${PORT}`);
})