const {sign,verify} = require("jsonwebtoken")
const { errorCreator } = require("./responseCreator")

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (email,role)=>{
  if(!email || !role){
    errorCreator("Either email or Role Missing",404)
  }
  const token = sign({email,role},JWT_SECRET,{expiresIn:"1d"})
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