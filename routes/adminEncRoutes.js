// All routes here requires JWT Auth token to be access and all are classified to the Admin

const { Router } = require('express')
const JWTAuther = require('../src/validation/jwtAuth')
const ErrorCodes = require('../src/helpers/error')

module.exports = (adminSchema, pendingUser, approveUser) => {
  const router = Router()

  router.post('/approve', JWTAuther.authAdmin, async (req, res) => {
    try {
      //move the user to aa database
      const locatedUser = await pendingUser.findOneById(req.body.id)
      locatedUser['approvalDate'] = new Date(Date.now()) // update approvalDate
      await approveUser.insertMany([locatedUser]) // copy user to destination
      await pendingUser.deleteOne({ _id: req.body.id }) // delete user to source db
      res.status(200).send(`User ${locatedUser._id} was approved`)
    } catch (err) {
      console.log(err)
      let { status, description } = ErrorCodes.getErrorStatAndDescription(err)
      res.status(status).send(description)
    }
  })

  router.get('/dashboard', JWTAuther.authAdmin, async (req, res) => {
    try {
      res.status(200).render('adminPage')
    } catch (err) {
      console.log(err)
      let { status, description } = ErrorCodes.getErrorStatAndDescription(err)
      res.status(status).send(description)
    }
  })

  router.get('/logout', async (req, res) => {
    try {
      res = JWTAuther.clearCookies(res, [
        process.env.COOKIE_ACCESS_ADMIN,
        process.env.COOKIE_REFRESH_ADMIN
      ])
      return res.status(200).send('/admin')
    } catch (err) {
      console.log(err)
      let { status, description } = ErrorCodes.getErrorStatAndDescription(err)
      res.status(status).send(description)
    }
  })

  return router
}
