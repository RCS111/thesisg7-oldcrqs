// All routes here requires JWT Auth token to be access and all are classified to the Admin

const { Router } = require('express')
const JWTAuther = require('../src/validation/jwtAuth')
const ErrorCodes = require('../src/helpers/error')

module.exports = (adminSchema, pendingUser, approveUser) => {
  const router = Router()

  router.get('/dashboard', JWTAuther.auth, async (req, res) => {
    try {
      res.status(200).render('userPage');
    } catch (err) {
      console.log(err)
      let { status, description } = ErrorCodes.getErrorStatAndDescription(err)
      res.status(status).send(description)
    }
  })

  router.get('/logout', async (req, res) => {
    try {
      res = JWTAuther.clearCookies(res, [
        process.env.COOKIE_ACCESS_USER,
        process.env.COOKIE_REFRESH_USER
      ])
      return res.status(200).send('/')
    } catch (err) {
      console.log(err)
      let { status, description } = ErrorCodes.getErrorStatAndDescription(err)
      res.status(status).send(description)
    }
  })

  return router
}
