const { Router } = require('express')
const jwt = require('jsonwebtoken')

// utility class
const JWTAuther = require('../src/validation/jwtAuth')
const ErrorCodes = require('../src/manager/error')
const Validator = require('../src/validation/validation')
const Crypter = require('../src/validation/crypter')
const Utility = require('../src/manager/utility')

module.exports = adminSchema => {
  const router = Router()

  router.get('/', (req, res) => {
    try {
      // check if token was exist perform previous session
      const token = req.signedCookies[process.env.COOKIE_ACCESS_ADMIN]
      if (token) {
        const verified = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        req.user = verified
        return res.redirect('/admin/dashboard') // <- redirecct to dashboard
      }
    } catch (err) {
      console.log(err);
      if (err.message === "jwt expired") {
        return res.redirect('/admin/refresh-admin-token')
      }
      JWTAuther.clearCookies(res, [
        process.env.COOKIE_ACCESS_ADMIN,
        process.env.COOKIE_REFRESH_ADMIN
      ])
      return res.redirect('/admin')
    }
    return res.status(200).render('aLogin')
  })

  router.post('/register', async (req, res) => {
    // VALIDATING REQUEST USING JOI
    const { error } = Validator.validateAdminRegister(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // DETECTING EXISITING ACCOUNTS
    const isEmailExist = await adminSchema.findOneUser({
      email: req.body.email
    })

    if (isEmailExist)
      return res
        .status(400)
        .send(
          ErrorCodes.getErrorByCode(ErrorCodes.Database, 11000).type.find(
            i => i.key == 'email'
          ).description
        )

    // EXTRA CATCHING ERROR CODES
    try {
      // HASHING PASSWORD
      const hashedPass = await Crypter.hashPass(req.body.password)
      req.body.password = hashedPass

      // CREATING ADMIN USER AND SAVING IT
      const admin = adminSchema.createSchema(req.body)
      const savedAdmin = await admin.save()
      res.status(200).send(savedAdmin)
    } catch (error) {
      console.log(error)
      let { status, description } = ErrorCodes.getErrorStatAndDescription(error)
      res.status(status).send(description)
    }
  })

  router.post('/login', async (req, res) => {
    try {
      // VALIDATING REQUEST USING JOI
      const { error } = Validator.validateAdminLogin(req.body)
      if (error)
        return res
          .status(400)
          .send(Utility.getAlertBox(error.details[0].message))

      // SEARCH USER TO ADMIN DB
      const adminUser = await adminSchema.findOneUser({ email: req.body.email })

      if (!adminUser) {
        // accouunt does not exisit
        const { status, description } = ErrorCodes.getErrorByCode(
          ErrorCodes.Login,
          1
        )
        return res.status(status).send(Utility.getAlertBox(description))
      }

      // VALIDATE PASSWORD
      const result = await Crypter.validateHashPass(
        req.body.password,
        adminUser.pass
      )
      if (result.status !== ErrorCodes.successItem.status) {
        return res
          .status(result.status)
          .send(Utility.getAlertBox(result.description))
      }

      // CREATE AND GIVE THE TOKEN TO THE APPROVED USER -> TOKEN IS USED TO VERIFY PRIVATE ROUTES
      const {
        tokenAccess,
        tokenRefresh
      } = await JWTAuther.createAccessAndRefreshTokens(adminUser._id)
      //save the access and refresh token to cokies
      res = JWTAuther.saveTokensToCookieAdmin(res, tokenAccess, tokenRefresh)
      res.status(ErrorCodes.successItem.status).send('/admin/dashboard') // <- send the path of the next page or redirect to dashboard
    } catch (error) {
      console.log(error)
      let { status, description } = ErrorCodes.getErrorStatAndDescription(error)
      return res.status(status).send(Utility.getAlertBox(description))
    }
  })

  router.get('/refresh-admin-token', async (req, res) => {
    // handle refresh rokens here
    // CHECK IF REFRESH TOKEN EXIST
    const token = req.signedCookies[process.env.COOKIE_REFRESH_ADMIN] // get the cookie and access refresh token
    if (!token) {
      JWTAuther.clearCookies(res, [
        process.env.COOKIE_ACCESS_ADMIN,
        process.env.COOKIE_REFRESH_ADMIN
      ])
      return res.redirect('/admin') // <- redirect to login page
    }

    // VERIFY REFRESH TOKEN
    try {
      const verified = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
      if (verified) {
        // check pass phrase
        var { status, description } = await Crypter.validateHashPass(
          JWTAuther.createPassPhrase(verified.id),
          verified.phrase
        )
        if (status === ErrorCodes.successItem.status) {
          //create a new access and refresh token token
          const {
            tokenAccess,
            tokenRefresh
          } = await JWTAuther.createAccessAndRefreshTokens(verified.id)
          //save the access and refresh token to cokies
          res = JWTAuther.saveTokensToCookieAdmin(
            res,
            tokenAccess,
            tokenRefresh
          )
          return res.redirect('/admin/dashboard') // revalidate cookie by navigating to dashboard
        }
        throw ''
      }
      throw ''
    } catch (error) {
      JWTAuther.clearCookies(res, [
        process.env.COOKIE_ACCESS_ADMIN,
        process.env.COOKIE_REFRESH_ADMIN
      ])
      return res.redirect('/admin') // <- redirect to login
    }
  })

  return router
}
