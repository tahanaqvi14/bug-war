import Joi from 'joi';
import bcrypt from 'bcrypt';

const Authenticator = async (input) => {
  const { displayname, username, password } = input;

  // Validate input using Joi
  const userSchema = Joi.object({
    displayname: Joi.string().min(1).required(),
    username: Joi.string().min(1).required(),
    password: Joi.string().min(8).required(),
  });

  const { error } = userSchema.validate({ displayname, username, password });
  if (error) {
    throw new Error('Please fill out the fields correctly: ' + error.message);
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
