const {sign,verify} = require("jsonwebtoken")
const { errorCreator } = require("./responseCreator")

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (username,role)=>{
  if(!username || !role){
    errorCreator("Either Username or Role Missing",404)
  }
  const token = sign({username,role},JWT_SECRET,{expiresIn:"1d"})
  if(!token){
    errorCreator("Error Creating Token")
  }
  return token
}

const verifyToken = (token)=>{
  if(!token){
    errorCreator("Token Missing For Verification",401)
  }
  const isTokenValid = verify(token,JWT_SECRET)
  return isTokenValid
}

module.exports = {generateToken,verifyToken}