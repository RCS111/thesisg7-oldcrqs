const { Router } = require('express')
const JWTAuther = require('../src/validation/jwtAuth')
const ErrorCodes = require('../src/manager/error')
const Crypter = require('../src/validation/crypter')
const Validator = require('../src/validation/validation')

module.exports = (pendingUser, approveUser) => {
  const router = new Router()

  router.get('/', (req, res) => {
    res.status(200).render('index')
  })

  router.post('/register', async (req, res) => {
    //JOI IS PROBABLY NOT REQUIRED
    const { error } = Validator.validateUserRegister(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // DETECTING EXISITING ACCOUNTS
    const isEmlPendExst = await pendingUser
      .getSchema()
      .findOne({ email: req.body.email })
    const isEmlApprExst = await approveUser
      .getSchema()
      .findOne({ email: req.body.email })

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
      res.status(status).send(description)
    }
  })

  router.post('/login', async (req, res) => {
    try {
      // VALIDATING REQUEST USING JOI
      const { error } = Validator.validateUserLogin(req.body)
      if (error) return res.status(400).send(error.details[0].message)

      // CHECK PENDING ACCOUNTS DATABASE
      const isEmlPendExst = await pendingUser
        .getSchema()
        .findOne({ email: req.body.email })

      if (isEmlPendExst) {
        // VALIDATE PASSWORD
        const result = await Crypter.validateHashPass(
          req.body.password,
          isEmlPendExst.pass
        )
        if (result.status !== ErrorCodes.successItem.status) {
          return res.status(result.status).send(result.description)
        }

        // account is waiting for approval
        const { status, description } = ErrorCodes.getErrorByCode(
          ErrorCodes.Login,
          0
        )
        return res.status(status).send(description)
      }

      // CHECK APPROVED ACCOUNTS DATABASE
      const isEmlApprExst = await approveUser
        .getSchema()
        .findOne({ email: req.body.email })

      if (!isEmlApprExst) {
        // accouunt does not exisit
        const { status, description } = ErrorCodes.getErrorByCode(
          ErrorCodes.Login,
          1
        )
        return res.status(status).send(description)
      }

      // VALIDATE PASSWORD
      const result = await Crypter.validateHashPass(
        req.body.password,
        isEmlApprExst.pass
      )
      if (result.status !== ErrorCodes.successItem.status) {
        return res.status(result.status).send(result.description)
      }

      // CREATE AND GIVE THE TOKEN TO THE APPROVED USER -> TOKEN IS USED TO VERIFY PRIVATE ROUTES
      const token = JWTAuther.getToken({ id: isEmlApprExst._id })
      res.header(JWTAuther.getAuthHeaderLbl(), token).send('LOGIN APPROVED') // <- send the path of the next page or redirect to dashboard
    } catch (error) {
      console.log(error)
      let { status, description } = ErrorCodes.getErrorStatAndDescription(error)
      res.status(status).send(description)
    }
  })

  return router
}
