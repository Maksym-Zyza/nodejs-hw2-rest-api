const Joi = require("joi");

// Валідація users для маршрутів
// POST - signUp
const schemaCreateUser = Joi.object({
  name: Joi.string().min(2).optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "ua", "org"] },
    })
    .required(),
  password: Joi.string().min(6).required(),
});

// VALIDATE
const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (err) {
    next({ status: 400, message: `Field ${err.message.replace(/"/g, "'")}` });
  }
};

module.exports.validateCreateUser = (req, _res, next) => {
  return validate(schemaCreateUser, req.body, next);
};
