// use for database and server validation
class ErrorCodes {
  static successItem = { code: 0, status: 200, description: 'OK' }

  static Database = [
    { code: 0, status: 500, description: 'Something went wrong' },
    {
      code: 1,
      status: 401,
      description: 'The provided credentials are invalid'
    },
    {
      code: 2,
      status: 401,
      description: 'The provided credentials are invalid'
    },
    {
      code: 11000,
      status: 400,
      type: [
        { key: 'uname', description: 'Username already in use' },
        { key: 'email', description: 'Email already in use' }
      ]
    }
  ]

  static Jwt = [
    { code: 0, status: 401, description: 'Unauthorized Access' }, // <- user is not authenticated
    { code: 1, status: 401, description: 'Unauthorized Access' } //< invalid token
  ]

  static Login = [
    {
      code: 0,
      status: 401,
      description: 'Your account is waiting for approval'
    },
    { code: 1, status: 401, description: 'Account does not exist' }
  ]

  static getErrorByCode (errLib, code) {
    return errLib.find(i => i.code === code)
  }

  static getErrorStatAndDescription (error) {
    let errDescription

    //look for error item
    let errorItem = ErrorCodes.getErrorByCode(ErrorCodes.Database, error.code)

    if (errorItem === undefined)
      errorItem = ErrorCodes.getErrorByCode(ErrorCodes.Database, 0)
    if (errorItem.code == 11000) {
      // 11000 has multiple keys based on duplicated fields
      errDescription = errorItem.type.find(
        i => i.key === Object.keys(error.keyValue)[0]
      ).description
    } else errDescription = errorItem.description

    return { status: errorItem.status, description: errDescription }
  }
}

module.exports = ErrorCodes
