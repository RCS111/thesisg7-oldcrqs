const { Router } = require('express')
const JWTAuther = require('../src/validation/jwtAuth')
const jwt = require('jsonwebtoken')
const ErrorCodes = require('../src/helpers/error')
const Crypter = require('../src/validation/crypter')
const Validator = require('../src/validation/validation')
const Utility = require('../src/helpers/utility')

module.exports = (pendingUser, approveUser) => {
  const router = new Router()

  router.get('/', (req, res) => {
    try {
      // check if token was exist prefrom previous session
      const token = req.signedCookies[process.env.COOKIE_ACCESS_USER]
      if (token) {
        const verified = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        req.user = verified
        return res.redirect('/dashboard') // <- redirecct to dashboard
      }
    } catch (err) {
      console.log(err)
      if (err.message === "jwt expired") {
        return res.redirect('/refresh-token')
      }
      JWTAuther.clearCookies(res, [
        process.env.COOKIE_ACCESS_USER,
        process.env.COOKIE_REFRESH_USER
      ])
      return res.redirect('/')
    }
    return res.status(200).render('uLogin')
  })

  router.get('/signup', async (req, res) => {
    try {
      res.status(200).render('uRegister');
    } catch (err){
      
    }
  });

  router.post('/register', async (req, res) => {
    //JOI IS PROBABLY NOT REQUIRED
    const { error } = Validator.validateUserRegister(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // DETECTING EXISITING ACCOUNTS
    const isEmlPendExst = await pendingUser.findOneUser({
      email: req.body.email
    })
    const isEmlApprExst = await approveUser.findOneUser({
      email: req.body.email
    })

    if (isEmlPendExst || isEmlApprExst) {
      return res
        .status(400)
        .send(
          ErrorCodes.getErrorByCode(ErrorCodes.Database, 11000).type.find(
            i => i.key == 'email'
          ).description
        )
    }

    // EXTRA CATCHING ERROR CODES
    try {
      // HASHING PASSWORD
      const hashedPass = await Crypter.hashPass(req.body.password)
      req.body.password = hashedPass

      // create user
      const user = pendingUser.createUser(req.body)
      const savedUser = await user.save()
      res.status(200).send({ _id: savedUser._id })
    } catch (error) {
      console.log(error)
      let { status, description } = ErrorCodes.getErrorStatAndDescription(error)
      return res.status(status).send(description)
    }
  })

  router.post('/login', async (req, res) => {
    try {
      // VALIDATING REQUEST USING JOI
      const { error } = Validator.validateUserLogin(req.body)
      if (error)
        return res
          .status(400)
          .send(Utility.getAlertBox(error.details[0].message))

      // CHECK PENDING ACCOUNTS DATABASE
      const isEmlPendExst = await pendingUser.findOneUser({
        email: req.body.email
      })

      if (isEmlPendExst) {
        // VALIDATE PASSWORD
        const result = await Crypter.validateHashPass(
          req.body.password,
          isEmlPendExst.pass
        )
        if (result.status !== ErrorCodes.successItem.status) {
          return res
            .status(result.status)
            .send(Utility.getAlertBox(result.description))
        }

        // account is waiting for approval
        const { status, description } = ErrorCodes.getErrorByCode(
          ErrorCodes.Login,
          0
        )
        return res.status(status).send(Utility.getAlertBox(description))
      }

      // CHECK APPROVED ACCOUNTS DATABASE
      const isEmlApprExst = await approveUser.findOneUser({
        email: req.body.email
      })

      if (!isEmlApprExst) {
        // accouunt does not exist
        const { status, description } = ErrorCodes.getErrorByCode(
          ErrorCodes.Login,
          1
        )
        return res.status(status).send(Utility.getAlertBox(description))
      }

      // VALIDATE PASSWORD
      const result = await Crypter.validateHashPass(
        req.body.password,
        isEmlApprExst.pass
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
      } = await JWTAuther.createAccessAndRefreshTokens(isEmlApprExst._id)
      //save the access and refresh token to cokies
      res = JWTAuther.saveTokensToCookie(res, tokenAccess, tokenRefresh)

      res.status(ErrorCodes.successItem.status).send('/dashboard') // <- send the path of the next page or redirect to dashboard
    } catch (error) {
      console.log(error)
      let { status, description } = ErrorCodes.getErrorStatAndDescription(error)
      return res.status(status).send(Utility.getAlertBox(description))
    }
  })

  router.get('/refresh-token', async (req, res) => {
    // handle refresh rokens here
    // CHECK IF REFRESH TOKEN EXIST
    const token = req.signedCookies[process.env.COOKIE_REFRESH_USER] // get the cookie and access refresh token
    if (!token) {
      JWTAuther.clearCookies(res, [
        process.env.COOKIE_ACCESS_USER,
        process.env.COOKIE_REFRESH_USER
      ])
      return res.redirect('/') // <- redirect to login page
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
          res = JWTAuther.saveTokensToCookie(res, tokenAccess, tokenRefresh)
          return res.redirect('/dashboard') // revalidate cookie by navigating to dashboard
        }
        throw ''
      }
      throw ''
    } catch (error) {
      JWTAuther.clearCookies(res, [
        process.env.COOKIE_ACCESS_USER,
        process.env.COOKIE_REFRESH_USER
      ])
      return res.redirect('/') // <- redirect to login
    }
  })

  return router
}
