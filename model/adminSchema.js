const mongoose = require('mongoose')
const Utility = require('../src/helpers/utility')

class AdminSchema {
  constructor () {
    this.adminSchema = new mongoose.Schema({
      name: {
        fName: {
          type: String,
          max: 255,
          min: 1,
          required: true
        },
        midName: {
          type: String,
          max: 255,
          min: 1
        },
        lName: {
          type: String,
          max: 255,
          min: 1,
          required: true
        },
        extName: {
          type: String,
          max: 255,
          min: 1
        }
      },

      email: {
        type: String,
        required: true,
        trim: true,
        max: 255,
        min: 8,
        unique: true
      },

      pass: {
        type: String,
        required: true,
        max: 1024,
        min: 8
      },

      position: {
        type: String,
        required: true,
        max: 20,
        min: 8
      },

      dateAdded: {
        type: Date,
        default: Date.now
      }
    })
  }

  getSchema () {
    // model(db_name, schema, collection_name)
    return mongoose.model(
      process.env.ADMIN_DB,
      this.adminSchema,
      process.env.ADMIN_DB
    );
  }

  createSchema (req_body) {
    return this.getSchema()({
      name: {
        fName: Utility.replaceToNull(req_body.name.first),
        midName: Utility.replaceToNull(req_body.name.middle),
        lName: Utility.replaceToNull(req_body.name.last),
        extName: Utility.replaceToNull(req_body.name.extension)
      },
      email: Utility.replaceToNull(req_body.email),
      pass: Utility.replaceToNull(req_body.password),
      position: Utility.replaceToNull(req_body.position)
    });
  }

  async findOneUser(queryParams) {
    return await this.getSchema().findOne(queryParams);
  }
}

module.exports = AdminSchema
