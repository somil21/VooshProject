// controllers/userController.js
const User = require('../models/User');
const { handleError } = require('../utils/errorUtils');

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return next(handleError(null, 'User not found'));
    }
    res.status(200).json(user);
  } catch (err) {
    next(handleError(err, 'Error retrieving user profile'));
  }
};

exports.updateUserProfile = async (req, res, next) => {
  try {
    const { name, bio, phone, email, isPublic } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, bio, phone, email, isPublic },
      { new: true }
    );
    if (!user) {
      return next(handleError(null, 'User not found'));
    }
    res.status(200).json(user);
  } catch (err) {
    next(handleError(err, 'Error updating user profile'));
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) {
      return next(handleError(null, 'User not found'));
    }
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return next(handleError(null, 'Invalid old password'));
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    next(handleError(err, 'Error updating password'));
  }
};

exports.uploadPhoto = async (req, res, next) => {
  try {
    const { photoUrl } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { photo: photoUrl },
      { new: true }
    );
    if (!user) {
      return next(handleError(null, 'User not found'));
    }
    res.status(200).json(user);
  } catch (err) {
    next(handleError(err, 'Error uploading photo'));
  }
};

exports.getPublicProfiles = async (req, res, next) => {
  try {
    const publicProfiles = await User.find({ isPublic: true }).select('-password');
    res.status(200).json(publicProfiles);
  } catch (err) {
    next(handleError(err, 'Error retrieving public profiles'));
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return next(handleError(null, 'User not found'));
    }
    if (user.isPublic || req.user.isAdmin) {
      res.status(200).json(user);
    } else {
      return next(handleError(null, 'User profile is private'));
    }
  } catch (err) {
    next(handleError(err, 'Error retrieving user profile'));
  }
};