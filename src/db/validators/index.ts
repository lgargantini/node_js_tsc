import Joi from "joi";
import { PASSWORD_REGEX } from "../../utils/constants";

export const userSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' })
    .messages({
      'string.required': 'ID must be valid'
    }),
  email: Joi.string().email().required().messages({
    'string.required': 'Email must be valid'
  }),
  name: Joi.string().required(),
  password: Joi.string().pattern(new RegExp(PASSWORD_REGEX)).required(),
  role: Joi.string().valid("USER", "ADMIN"),
});

export const userAuthSchema = Joi.string().guid({ version: 'uuidv4' })
  .messages({
    'string.required': 'ID must be valid'
  });

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.required': 'Email must be valid'
  }),
  password: Joi.string().pattern(new RegExp(PASSWORD_REGEX)).required(),
})

export const tokenSchema = Joi.object(({
  id: Joi.number(),
  user_id: Joi.string().guid({ version: 'uuidv4' })
    .messages({
      'string.required': 'ID must be a valid'
    }),
  reset_token: Joi.string().required(),
  reset_token_expiration: Joi.number(),
}));

export const userEmail = Joi.object({
  email: Joi.string().email().required().messages({
    'string.required': 'Email must be valid'
  }),
});

export const resetTokenSchema = Joi.object({
  reset_token: Joi.string().required(),
  password: Joi.string().pattern(new RegExp(PASSWORD_REGEX)).required()
});

export const membershipSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' })
    .messages({
      'string.required': 'ID must be valid'
    }),
  avatar_url: Joi.string().required(),
  avatar_letter: Joi.string().required(),
  name: Joi.string().required(),
});

export default {
  userSchema,
  userEmail,
  tokenSchema
}
