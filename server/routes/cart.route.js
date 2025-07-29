const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const { getCartItemsController, addToCartController, incrementController, decrementController, removeProductController, clearCartController } = require("../controllers/cart.controller")
const cartRouter = express.Router()

cartRouter.get("/",authMiddleware,getCartItemsController)
cartRouter.post("/addToCart",authMiddleware,addToCartController)
cartRouter.patch("/increment",authMiddleware,incrementController)
cartRouter.patch("/decrement",authMiddleware,decrementController)
cartRouter.patch("/removeProduct", authMiddleware, removeProductController);
cartRouter.put("/clearCart", authMiddleware, clearCartController);


module.exports = cartRouter;