//use for input validation
const Joi = require('@hapi/joi')

class Validator {
  static validateUserRegister (req_body) {
    const userRegValidation = Joi.object({
      email: Joi.string()
        .min(8)
        .max(255)
        .email()
        .required(),
      password: Joi.string()
        .min(8)
        .required(),
      name: Joi.object({
        first: Joi.string()
          .min(1)
          .max(255)
          .required(),
        middle: Joi.string()
          .min(0)
          .max(255),
        last: Joi.string()
          .min(1)
          .max(255)
          .required(),
        extension: Joi.string()
          .min(0)
          .max(255)
      }).required(),
      sex: Joi.string()
        .min(1)
        .max(1)
        .required(),
      address: Joi.object({
        house: Joi.string()
          .min(0)
          .max(255),
        blk: Joi.string()
          .min(1)
          .max(255)
          .required(),
        lot: Joi.string()
          .min(1)
          .max(255)
          .required(),
        purok: Joi.string()
          .min(1)
          .max(255)
          .required(),
        street: Joi.string()
          .min(0)
          .max(255)
      }).required(),
      year: Joi.string()
        .min(1)
        .required(),
      civilStatus: Joi.string()
        .min(1)
        .required(),
      birth: Joi.object({
        date: Joi.date().required(),
        place: Joi.string().required()
      }).required(),

      contactNumber: Joi.array()
        .min(1)
        .required(),
      vaccinationStatus: Joi.string()
        .min(1)
        .max(1)
        .required(),
      approvalDate: Joi.string().default(null)
    })

    return userRegValidation.validate(req_body)
  }

  static validateAdminRegister (req_body) {
    const adminRegValidation = Joi.object({
      name: Joi.object({
        first: Joi.string()
          .min(1)
          .max(255)
          .required(),
        middle: Joi.string()
          .min(1)
          .max(255),
        last: Joi.string()
          .min(1)
          .max(255),
        extension: Joi.string()
          .min(1)
          .max(255)
      }).required(),
      email: Joi.string()
        .min(8)
        .max(255)
        .email()
        .required(),
      password: Joi.string()
        .min(8)
        .required(),
      position: Joi.string()
        .min(6)
        .max(20)
        .required()
    })

    return adminRegValidation.validate(req_body)
  }

  //add other validators here
  static validateUserLogin (req_body) {
    const userLoginValidation = Joi.object({
      email: Joi.string()
        .min(8)
        .max(255)
        .email()
        .required(),
      password: Joi.string()
        .min(8)
        .required()
    });

    return userLoginValidation.validate(req_body)
  }

  //add other validators here
  static validateAdminLogin (req_body) {
    const adminLoginValidation = Joi.object({
      email: Joi.string()
        .min(8)
        .max(255)
        .email()
        .required(),
      password: Joi.string()
        .min(8)
        .required()
    });

    return adminLoginValidation.validate(req_body)
  }
}

module.exports = Validator
