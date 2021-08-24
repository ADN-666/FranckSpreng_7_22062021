const Joi = require("joi");

module.exports = (req, res, next) => {
  const validUpdate = (data) => {
    const schema = Joi.object({
      username: Joi.string().required(),
      email: Joi.string().email().required(),
      bio: Joi.string().empty(""),
      image: Joi.string().empty(""),
    });

    return schema.validate(data);
  };
  const { error } = validUpdate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  } else {
    next();
  }
};
