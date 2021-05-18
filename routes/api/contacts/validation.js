const Joi = require("joi");

// Валідація контактів для маршрутів
// POST
const schemaCreateContact = Joi.object({
  name: Joi.string()
    .alphanum()
    .regex(/[A-Z]\w+/)
    .min(3)
    .max(30)
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "ua", "org"] },
    })
    .required(),
  phone: Joi.string()
    .regex(/^\+?(\d{1,3})?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/)
    .required(),
  favorite: Joi.boolean().optional(),
});

// PUT
const schemaUpdateContact = Joi.object({
  name: Joi.string()
    .alphanum()
    .regex(/[A-Z]\w+/)
    .min(3)
    .max(30)
    .optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "ua", "org"] },
    })
    .optional(),
  phone: Joi.string()
    .regex(/^\+?(\d{1,3})?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/)
    .optional(),
  favorite: Joi.boolean().optional(),
});

// PATCH
const schemaUpdateFavorite = Joi.object({
  favorite: Joi.boolean().optional(),
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

module.exports.validateCreateContact = (req, _res, next) => {
  return validate(schemaCreateContact, req.body, next);
};

module.exports.validateUpdateContact = (req, _res, next) => {
  return validate(schemaUpdateContact, req.body, next);
};

module.exports.validateUpdateFavorite = (req, _res, next) => {
  return validate(schemaUpdateFavorite, req.body, next);
};
