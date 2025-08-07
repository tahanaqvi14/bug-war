import Joi from 'joi';
import bcrypt from 'bcrypt';

const Authenticator = async (input) => {
  const { displayname, username, password } = input;

  // Validate input using Joi
  const userSchema = Joi.object({
    displayname: Joi.string().min(3).max(10).required().messages({
      'string.max': 'Display name must be at most 10 characters',
      'string.min': 'Display name must be at least 3 characters',
      'any.required': 'Display name is required'
    }),

    username: Joi.string().min(4).max(12).required().messages({
      'string.max': 'Username must be at most 12 characters',
      'string.min': 'Username must be at least 4 characters',
      'any.required': 'Username is required'
    }),

    password: Joi.string().min(8).max(20).required().messages({
      'string.max': 'Password must be at most 20 characters',
      'string.min': 'Password must be at least 8 characters',
      'any.required': 'Password is required'
    }),
  });

  const { error } = userSchema.validate({ displayname, username, password });
  if (error) {
    throw new Error(error.message);
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // Return processed and safe data
  return {
    displayname,
    username,
    hash,
  };
};

export default Authenticator;
