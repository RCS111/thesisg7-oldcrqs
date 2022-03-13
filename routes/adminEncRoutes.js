// All routes here requires JWT Auth token to be access and all are classified to the Admin

const { Router } = require('express')
const JWTAuther = require('../src/validation/jwtAuth')
const AdminSchema = require('../model/adminSchema')
const UserSchema = require('../model/userSchema')
const ErrorCodes = require('../src/manager/error')

module.exports = (adminSchema, pendingUser, approveUser) => {
  const router = Router()

  router.post('/approve', JWTAuther.auth, async (req, res) => {
    try {
      //move the user to aa database
      const locatedUser = await pendingUser.getSchema().findById(req.body.id)
      locatedUser['approvalDate'] = new Date(Date.now()); // update approvalDate
      await approveUser.getSchema().insertMany([locatedUser]) // copy user to destination
      await pendingUser.getSchema().deleteOne({ _id: req.body.id }) // delete user to source db
      res.status(200).send(`User ${locatedUser._id} was approved`)
    } catch (err) {
      console.log(err)
      let { status, description } = ErrorCodes.getErrorStatAndDescription(err)
      res.status(status).send(description)
    }
  })

  return router
}
