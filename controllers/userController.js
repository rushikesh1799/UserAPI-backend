const User = require('../models/user.js');

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const secret = "any";

// this is the optimized kind of signup function which u can directly use in user.router.js file, here we have combined database saving of the document and the various res responses to the server.
// Ladies and Gentlemen, newSignup for u! - try to make one for the login as well.
async function newSignup(req, res) {
  const data = req.body;

  let userExists;
  try {
    userExists = await User.findOne({ email: data.email });
  } catch (error) {
    return res.status(500).json({ message: "Signup failed, Please try again later!" });
  }
  if (userExists) {
    return res.status(409).json({ message: "User already exists!" });
  }

  let hashedPassword;
  try {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(data.password, salt);
  } catch (error) {
    return res.status(500).json({ message: "Signup failed, Please try again later!" });
  }

  const newUser = new User({
    ...data,
    password: hashedPassword
  })

  // let createdUser;
  try {
    await newUser.save();
  } catch (error) {
    return res.status(500).json({ message: "Signup failed, Please try again later!" });
  }
  const token = jwt.sign({ userId: newUser._id }, secret, { expiresIn: '24hr' });
  res.status(201).json({ message: "Signup successful!", user: { token: token, ...newUser } })

}

async function signup(userDetails) {
  try {
    const { email, password } = userDetails;
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      console.log(`User already exists: `, userExists);
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User(userDetails)
      newUser.password = hashedPassword;
      const savedUser = await newUser.save();
      if (savedUser) {
        console.log(`User has been created: `, savedUser);
        return savedUser;
      } else {
        console.log(`Could not able to create new User.`);
      }
    }
  } catch (error) {
    console.error(`Error creating the User.`, error)
  }
}

async function login(userDetails) {
  try {
    const { email, password } = userDetails;
    const user = await User.findOne({ email: email });
    if (!user) {
      console.log(`User is not present.`)
    } else {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '24hr' });
        console.log(`Welcome!, user has been logged in.`, token);
        return ({ token: token, user: user })
      } else {
        console.log(`Please enter the correct Password and try again!`);
      }
    }
  } catch (error) {
    console.error(`Error logging in, Please try again!`, error)
  }
}

async function changePassword(userId, currentPassword, newPassword) {
  try {
    const user = await User.findOne({ _id: userId })
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (user && passwordMatch) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      const updatedUser = await user.save();
      console.log(`Password changed for ${updatedUser.username}:`, updatedUser);
      return updatedUser;
    } else {
      console.log(`Please enter the correct current password.`)
    }
  } catch (error) {
    console.error(`Error logging in`, error)
  }
}

async function updateProfilePicture(email, newProfilePictureURL) {
  try {
    const user = await User.findOne({ email: email })
    if (user) {
      user.profilePictureURL = newProfilePictureURL;
      const updatedUser = await user.save();
      if (updatedUser) {
        console.log(`Prodile picture has been updated for ${updatedUser.username}:`, updatedUser)
        return updatedUser;
      } else {
        console.log(`Could not able to update Prodile picture.`)
      }
    } else {
      console.log(`user not found, please try again!`)
    }
  } catch (error) {
    console.error(`Error updating profile picture.`)
  }
}

async function updateContactDetails(email, updatedContactDetails) {
  try {
    const user = await User.findOne({ email: email })
    if (user) {
      Object.assign(user, updatedContactDetails)
      const updatedUser = await user.save();
      if (updatedUser) {
        console.log(`Contact details has been updated for ${updatedUser.username}:`, updatedUser)
        return updatedUser;
      } else {
        console.log(`Could not able to update Contact details.`)
      }
    } else {
      console.log(`user not found, please try again!`)
    }
  } catch (error) {
    console.error(`Error updating profile picture.`)
  }
}

async function findUserByPhoneNumber(phoneNumber) {
  try {
    const userByPhoneNumber = await User.findOne({ phoneNumber: phoneNumber });
    if (userByPhoneNumber) {
      console.log(`User found by Phone number:`, userByPhoneNumber);
      return userByPhoneNumber;
    } else {
      console.log(`User not found.`)
    }
  } catch (error) {
    console.error(`Error finding user`, error);
  }
}

module.exports = {
  signup,
  login,
  changePassword,
  updateProfilePicture,
  updateContactDetails,
  findUserByPhoneNumber,
  newSignup
}


// newSignup({
//       email: "rushi@gmail.com",
//       password: "password",
//       profilePictureURL: "",
//       username: "rushi1",
//       nickname: "potato",
//     })
// signup({
//       email: "rushi@gmail.com",
//       password: "password",
//       profilePictureURL: "",
//       username: "rushi1",
//       nickname: "potato",
//     });
// login({
//   email: "rushi@gmail.com",
//   password: "omrushi"
// });
// changePassword("650bfe0d25f3490271af004d", "omrushi", "omrushi1");
// updateProfilePicture("rushi@gmail.com", "abc");
// updateContactDetails("rushi@gmail.com", {
//   email: "rushi1@gmail.com",
//   phoneNumber: 7058693670,
// });
// findUserByPhoneNumber(7058693670);