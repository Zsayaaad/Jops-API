const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const User = require('../models/User');

const register = async (req, res) => {
  // That user have a function once we create it & we will used it in generating a token for the user
  const user = await User.create({ ...req.body }); // To take just a shallow Copy ({...req.body}):
  const token = user.createJwt();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password); // ziad@gmail.com secret
  if (!email || !password) {
    throw new BadRequestError('Provide Email And Password.');
  }

  // Check Email
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError(
      'User not found. Please check your credentials.'
    );
  }

  // Check Password
  const isPassCorrect = await user.comparePasswords(password);
  if (!isPassCorrect) {
    throw new UnauthenticatedError(
      'User not found. Please check your credentials.'
    );
  }

  const token = user.createJwt();

  // console.log(req.user); // Obj of userId and name

  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
