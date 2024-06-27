import Joi from "joi";

export const userSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' })
        .messages({
          'string.required':'ID must be a UUID'
        }),
  email: Joi.string().email().required().messages({
    'string.required':'Email must be valid'
  }),
  name: Joi.string().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  role: Joi.string().valid("USER", "ADMIN"),
});

export const tokenSchema = Joi.object(({
  id: Joi.number(),
  user_id: Joi.string().guid({ version: 'uuidv4' })
  .messages({
    'string.required':'ID must be a UUID'
  }),
  reset_token: Joi.string().required(),
  reset_token_expiration: Joi.number(),
}));

export const userEmail = Joi.object({
  email: Joi.string().email().required().messages({
    'string.required':'Email must be valid'
  }),
});

export const resetTokenSchema = Joi.object({
  reset_token: Joi.string().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
});


export default {
  userSchema,
  userEmail,
  tokenSchema
}
