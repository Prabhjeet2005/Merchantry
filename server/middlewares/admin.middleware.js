const UserModel = require("../models/user.model");
const { verifyToken } = require("../utils/jwtUtil");
const { errorCreator } = require("../utils/responseCreator");

const adminMiddleware = async(req,res,next)=>{
  try {
    const {authToken} = req.cookies;
    if(!authToken){
      errorCreator("Token Missing",404);
    }
    const data = verifyToken(authToken)
    const {email,role} = data;
    const admin = await UserModel.findUser(email)
    if(role === "admin"){
      res.locals.admin = admin;
      next()
    }else{
      errorCreator("Not An Admin",403)
    }
  } catch (error) {
    next(error)
  }
}

module.exports = adminMiddleware;