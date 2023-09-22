const express = require('express');

const {
  signup,
  login,
  changePassword,
  updateProfilePicture,
  updateContactDetails,
  findUserByPhoneNumber,
  newSignup
} = require('../controllers/userController.js')

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const secret = "any";

const userRouter = express.Router();

// userRouter.post('/signup', newSignup);

userRouter.post('/signup', async (req, res) => {
  try {
    const createdUser = await signup(req.body);
    if (createdUser) {
      return res.status(201).json({ message: 'The user account has been created successfully!', user: createdUser });
    } else {
      return res.status(404).json({ message: 'Signup failed, Please try again!' });
    }
  } catch (error) {
    return res.status(500).json({ message: "Signup failed, Please try again later!" });
  }
});

userRouter.post('/login', async (req, res) => {
  try {
    const { token, user } = await login(req.body);
    if (user) {
      res.status(201).json({ message: `Logged In, and welcome ${user.username}!`, user: { token: token, user: user } });
    } else {
      res.status(404).json({ message: `Failed to login, please enter the correct email and password.` });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to login with the user credentials." })
  }
});

userRouter.post('/user/:userId/password', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { currentPassword, newPassword } = req.body;
    const userAfterPassChange = await changePassword(userId, currentPassword, newPassword);
    if (userAfterPassChange) {
      return res.status(201).json({ message: `The password for user ${userAfterPassChange.username} has been changed successfully!`, user: userAfterPassChange });
    } else {
      return res.status(404).json({ message: `Could not update the password, Please try again!` });
    }
  } catch (error) {
    return res.status(500).json({ message: `Error updating the password, Please try again later!` });
  }
});

userRouter.post('/user/:userId/profile', async (req, res) => {
  try {
    const { email, newProfilePictureUrl } = req.body;
    const updatedUser = await updateProfilePicture(email, newProfilePictureUrl);
    if (updatedUser) {
      return res.status(201).json({ message: `The profile picture for user ${updatedUser.username} has been changed successfully!`, user: updatedUser });
    } else {
      return res.status(404).json({ message: `Could not update the profile picture, Please try again!` });
    }
  } catch (error) {
    return res.status(500).json({ message: `Error updating the profile picture, Please try again later!` });
  }
});

userRouter.post('/update-contact/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const updatedUser = await updateContactDetails(email, req.body);
    if (updatedUser) {
      return res.status(201).json({ message: `The contact details for user ${updatedUser.username} has been updated successfully!`, user: updatedUser });
    } else {
      return res.status(404).json({ message: `Could not update the contact details, Please try again!` });
    }
  } catch (error) {
    return res.status(500).json({ message: `Error updating the contact details, Please try again later!` });
  }
});

userRouter.get('/users/phone/:phoneNumber', async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber
    const savedUser = await findUserByPhoneNumber(phoneNumber);
    if (savedUser) {
      return res.status(201).json({ message: `The user with phone number ${phoneNumber} is as follows:`, user: savedUser });
    } else {
      return res.status(404).json({ message: `Could not find the user with Phone number ${phoneNumber}, Please try again!` });
    }
  } catch (error) {
    return res.status(500).json({ message: `Error getting the user with Phone number ${phoneNumber}, Please try again later!` });
  }
});

module.exports = userRouter;