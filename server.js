const express = require('express')
const cookieParser = require('cookie-parser');
require('dotenv').config()

const DBManager = require('./src/manager/databaseMgr')

//port
let port = process.env.port || 3000

// database models
const AdminSchema = require('./model/adminSchema')
const UserSchema = require('./model/userSchema')
// db model objects
const adminSchema = new AdminSchema()
const pendingUser = new UserSchema(process.env.PEND_ACC_DB)
const approveUser = new UserSchema(process.env.APPR_ACC_DB)

const app = express()
app.set('view engine', 'ejs')
app.use(express.static('./frontend/static'))

//db connections
DBManager.config()

// middlwares
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(cookieParser([process.env.COOKIE_SECRET_USER, process.env.COOKIE_SECRET_ADMIN]));

//routes
app.use('/admin', require('./routes/adminRoutes')(adminSchema))
app.use('/admin', require('./routes/adminEncRoutes')(adminSchema, pendingUser, approveUser))
app.use(require('./routes/userRoutes')(pendingUser, approveUser))
app.use(require('./routes/userEncRoutes')(adminSchema, pendingUser, approveUser))

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at port : ${port}`)
})
