const jwt = require('jsonwebtoken')
const ErrorCodes = require('../manager/error.js')
require('dotenv').config()

class JWTAuther {
  static getAuthHeaderLbl () {
    return process.env.JWT_AUTH_HEADER_LBL
  }

  static getToken (data) {
    return jwt.sign(data, process.env.JWT_AUTH_SECRET)
  }

  static auth (req, res, next) {
    // CHECK IF TOKEN EXIST
    const token = req.header(process.env.JWT_AUTH_HEADER_LBL)
    if (!token) {
      const { status, description } = ErrorCodes.getErrorByCode(
        ErrorCodes.Jwt,
        0
      )
      return res.status(status).send(description) // <- redirect to login page
    }

    // VERIFY TOKEN
    try {
      const verified = jwt.verify(token, process.env.JWT_AUTH_SECRET)
      req.user = verified
      next()
    } catch (error) {
      const { status, description } = ErrorCodes.getErrorByCode(
        ErrorCodes.Jwt,
        1
      )
      return res.status(status).send(description) // <- redirect to login page
    }
  }
}

module.exports = JWTAuther
