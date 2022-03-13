const bcrypt = require('bcryptjs')
const ErrorCodes = require('../manager/error')

class Crypter {
  static async hashPass (plainTextPass) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(plainTextPass, salt)
  }

  static async validateHashPass (plainTextPass, hashedPass) {
    var isValidPass = await bcrypt.compare(plainTextPass, hashedPass)
    if (!isValidPass) {
      var result = ErrorCodes.getErrorByCode(ErrorCodes.Database, 2);
      return { status: result.status, description: result.description }
    }
    var stat = ErrorCodes.successItem.status
    var descr = ErrorCodes.successItem.description
    return { status: stat, description: descr }
  }
}

module.exports = Crypter
