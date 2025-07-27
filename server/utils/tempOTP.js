const speakeasy = require('speakeasy')
const qrcode = require('qrcode')

const generateQRCode = async(username)=>{
  const {base32:secret,otpauth_url:otpAuthURL} = speakeasy.generateSecret({
    issuer:"Merchantry",
    name:username
  })
  const QRcode = await qrcode.toDataURL(otpAuthURL)
  return {secret,QRcode}
}

const verifyQRcode = (secret,otp)=>{
  const isQRValid = speakeasy.totp.verify({
    secret,
    token:otp,
    encoding:"base32"
  })
  return isQRValid
}

module.exports = {generateQRCode,verifyQRcode}