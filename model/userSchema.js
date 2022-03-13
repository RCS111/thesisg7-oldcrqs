const req = require('express/lib/request')
const mongoose = require('mongoose')
const Utility = require('../src/manager/utility');

class UserSchema {
  constructor (db) {
    this.forDatabase = db
    this.userSchema = new mongoose.Schema({
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
        max: 1024,
        min: 8,
        required: true
      },

      fullName: {
        fName: {
          type: String,
          max: 255,
          min: 1,
          uppercase: true,
          required: true
        },
        midName: {
          type: String,
          uppercase: true,
          max: 255,
          min: 0
        },
        lName: {
          type: String,
          uppercase: true,
          max: 255,
          min: 1,
          required: true
        },
        extName: {
          type: String,
          uppercase: true,
          max: 255,
          min: 0
        }
      },

      sex: {
        type: String,
        uppercase: true,
        max: 1,
        min: 1,
        required: true
      },

      address: {
        houseNo: {
          type: String,
          uppercase: true,
          max: 255,
          min: 0
        },
        blkNo: {
          type: String,
          uppercase: true,
          max: 255,
          min: 1,
          required: true
        },
        lotNo: {
          type: String,
          uppercase: true,
          max: 255,
          min: 1,
          required: true
        },
        purokNo: {
          type: String,
          uppercase: true,
          max: 255,
          min: 1,
          required: true
        },
        street: {
          type: String,
          uppercase: true,
          max: 255,
          min: 0
        }
      },

      startYear: {
        type: String,
        max: 255,
        min: 1,
        required: true
      },

      civilStatus: {
        type: String,
        uppercase: true,
        max: 255,
        min: 1,
        required: true
      },

      birthDay: {
        date: {
          type: String,
          required: true
        },
        place: {
          type: String,
          uppercase: true,
          min: 2,
          max: 1024,
          required: true
        }
      },

      contactNo: [
        {
          type: String,
          max: 20,
          required: true
        }
      ],

      vaccStatus: {
        type: String,
        min: 1,
        max: 1,
        required: true
      },

      dateCreated: {
        type: Date,
        default: Date.now
      },

      approvalDate: {
        type: Date,
        default: null
      }
    })
  }

  getSchema () {
    // model(db_name, schema, collection_name)
    return mongoose.model(this.forDatabase, this.userSchema, this.forDatabase)
  }

  createUser (req_body) {
    return this.getSchema()({
      email: Utility.replaceToNull(req_body.email),
      pass: Utility.replaceToNull(req_body.password),
      fullName: {
        fName: Utility.replaceToNull(req_body.name.first),
        midName: Utility.replaceToNull(req_body.name.middle),
        lName: Utility.replaceToNull(req_body.name.last),
        extName: Utility.replaceToNull(req_body.name.extension)
      },
      sex: Utility.replaceToNull(req_body.sex),
      address: {
        houseNo: Utility.replaceToNull(req_body.address.house),
        blkNo: Utility.replaceToNull(req_body.address.blk),
        lotNo: Utility.replaceToNull(req_body.address.lot),
        purokNo: Utility.replaceToNull(req_body.address.purok),
        street: Utility.replaceToNull(req_body.address.street)
      },
      startYear: Utility.replaceToNull(req_body.year),
      civilStatus: Utility.replaceToNull(req_body.civilStatus),
      birthDay: {
        date: Utility.replaceToNull(req_body.birth.date),
        place: Utility.replaceToNull(req_body.birth.place)
      },
      contactNo: Utility.replaceToNull(req_body.contactNumber),
      vaccStatus: Utility.replaceToNull(req_body.vaccinationStatus),
      approvalDate: Utility.replaceToNull(req_body.approvalDate)
    })
  }
}

module.exports = UserSchema
