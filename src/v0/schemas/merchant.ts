import Joi, { ObjectSchema } from "joi";
const merchantSignupSchema: ObjectSchema = Joi.object().keys({
  fullname: Joi.string().required().min(4).max(50).messages({
    "string.base": "Full name must be of type string",
    "string.min": "Length should be minimum 4 characters",
    "string.max": "Length should not be more than 50",
    "string.empty": "Fullname is a required field",
  }),
  username: Joi.string()
    .required()
    .min(4)
    .max(10)
    .messages({ "string.base": "username is invalid" }),
  password: Joi.string().required().min(5).max(8).messages({
    "string.min": "Invalid password length (should be minimum 5 characters)",
    "string.max": "Invalid password lengthh (should be maximum 8 characters)",
    "string.empty": "Password is a required field",
  }),
  email: Joi.string().required().email().messages({
    "string.base": "Email must be of type string",
    "string.email": "Email must be valid",
    "string.empty": "Email is a required field",
  }),
  phone: Joi.string()
    .required()
    .messages({ "string.empty": "Phone is a required field" }),
});

export { merchantSignupSchema };
