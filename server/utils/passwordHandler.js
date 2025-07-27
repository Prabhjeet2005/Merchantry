const { compare, genSalt, hash } = require("bcrypt");
const { errorCreator } = require("./responseCreator");

const generatePassword = async (userPassword) => {
	const salt = await genSalt(10);
	const hashedPwd = await hash(userPassword, salt);
  if(!hashedPwd){
    errorCreator("Error Creating Hashed Password",400)
  }
  return hashedPwd
};

const verifyPassword = async(userPassword,hashedPwd)=>{
  const isPasswordSame = await compare(userPassword,hashedPwd)
  return isPasswordSame
}

module.exports = {generatePassword,verifyPassword}