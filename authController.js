// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { handleError } = require('../utils/errorUtils');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(handleError(err, 'Error registering user'));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return next(handleError(null, 'Invalid username or password'));
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(handleError(null, 'Invalid username or password'));
    }
    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(200).json({ token });
  } catch (err) {
    next(handleError(err, 'Error logging in'));
  }
};

exports.logout = (req, res) => {
  // Clear the JWT token from the client-side
  res.status(200).json({ message: 'Logged out successfully' });
};