const jwt = require('jsonwebtoken')
const Crypter = require('../validation/crypter')

require('dotenv').config()

class JWTAuther {
  /**
   * @deprecated
   */
  static getAuthHeaderLbl () {
    return process.env.JWT_AUTH_HEADER_LBL
  }

  static getAccessToken (data) {
    return jwt.sign(data, process.env.JWT_ACCESS_SECRET, {
      expiresIn: `${process.env.JWT_ACCESS_EXPIRE}`
    }) // <- token expires every hour
  }

  static getRefreshToken (data) {
    return jwt.sign(data, process.env.JWT_REFRESH_SECRET, {
      expiresIn: `${process.env.JWT_REFRESH_EXPIRE}`
    }) // <- token expires after 1y
  }

  static async createAccessAndRefreshTokens (payload) {
    const tokenAccess = JWTAuther.getAccessToken({ id: payload })
    const tokenRefresh = JWTAuther.getRefreshToken({
      id: payload,
      phrase: await Crypter.hashPass(JWTAuther.createPassPhrase(payload)) //<- add extra passPhrase identifier
    })
    return { tokenAccess, tokenRefresh }
  }

  static saveTokensToCookie (res, tokenAccess, tokenRefresh) {
    res = JWTAuther.getSignedCookie(
      res,
      process.env.COOKIE_ACCESS_USER,
      tokenAccess
    )
    res = JWTAuther.getSignedCookie(
      res,
      process.env.COOKIE_REFRESH_USER,
      tokenRefresh
    )
    return res
  }

  static saveTokensToCookieAdmin (res, tokenAccess, tokenRefresh) {
    res = JWTAuther.getSignedCookie(
      res,
      process.env.COOKIE_ACCESS_ADMIN,
      tokenAccess
    )
    res = JWTAuther.getSignedCookie(
      res,
      process.env.COOKIE_REFRESH_ADMIN,
      tokenRefresh
    )
    return res
  }

  static createPassPhrase (userId) {
    return `${userId}.${process.env.JWT_REFRESH_PASSPHRASE}`
  }

  static getSignedCookie (resObj, cookieName, cookieValue) {
    return resObj.cookie(cookieName, cookieValue, {
      httpOnly: true,
      signed: true
    })
  }

  static clearCookies (res, cookiesName) {
    cookiesName.forEach(cookie => {
      res.clearCookie(cookie)
    })
    return res
  }

  static auth (req, res, next) {
    // CHECK IF TOKEN EXIST
    // TODO: handle admin requesting in this auth
    const token = req.signedCookies[process.env.COOKIE_ACCESS_USER]
    if (!token) {
      return res.redirect('/') // <- redirect to login page
    }

    // VERIFY TOKEN
    try {
      const verified = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      req.user = verified
      next()
    } catch (error) {
      return res.redirect('/refresh-token') // <- redirect to refresh-token
    }
  }

  static authAdmin (req, res, next) {
    // CHECK IF TOKEN EXIST
    // TODO: handle user reqeustung in this auth
    const token = req.signedCookies[process.env.COOKIE_ACCESS_ADMIN]
    if (!token) {
      return res.redirect('/admin') // <- redirect to login page
    }

    // VERIFY TOKEN
    try {
      const verified = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      req.user = verified
      next()
    } catch (error) {
      return res.redirect('/admin/refresh-admin-token') // <- redirect to refresh-token
    }
  }
}

module.exports = JWTAuther
