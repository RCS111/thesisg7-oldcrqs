const { Router } = require('express')

// utility class
const JWTAuther = require('../src/validation/jwtAuth')
const ErrorCodes = require('../src/manager/error')
const Validator = require('../src/validation/validation')
const Crypter = require('../src/validation/crypter')

module.exports = adminSchema => {
  const router = Router()

  router.post('/register', async (req, res) => {
    // VALIDATING REQUEST USING JOI
    const { error } = Validator.validateAdminRegister(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // DETECTING EXISITING ACCOUNTS
    const isEmailExist = await adminSchema
      .getSchema()
      .findOne({ email: req.body.email })
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
    // VALIDATING REQUEST USING JOI
    const { error } = Validator.validateAdminLogin(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // SEARCH USER TO ADMIN DB
    const adminUser = await adminSchema
      .getSchema()
      .findOne({ email: req.body.email })
    if (!adminUser) {
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
      adminUser.pass
    )
    if (result.status !== ErrorCodes.successItem.status) {
      return res.status(result.status).send(result.description)
    }

    //check user if token exist

    // CREATE AND GIVE THE TOKEN TO THE APPROVED USER -> TOKEN IS USED TO VERIFY PRIVATE ROUTES
    const token = JWTAuther.getToken({ id: adminUser._id })
    res.header(JWTAuther.getAuthHeaderLbl(), token).send('LOGIN APPROVED') // <- send the path of the next page or redirect to dashboard
  })

  return router
}
