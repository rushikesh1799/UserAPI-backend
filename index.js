require('./db');

const User = require('./models/user.js');
const userRouter = require('./routes/user.router.js');
const movieRouter = require('./routes/movie.router.js');

const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const jwt = require("jsonwebtoken");
const secret = "any";

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    throw new Error('Invalid Token!')
  }
};

function extractUserIdFromToken(decodedToken) {
  if (decodedToken && decodedToken.userId) {
    return decodedToken.userId
  } else {
    throw new Error("Invalid or missing user Id token.")
  }
}

function authVerifyMiddleware(req, res, next) {
  const token = req.headers.authorization;

  try {
    const decoded = verifyToken(token);
    const userId = extractUserIdFromToken(decoded);
    req.user = { userId }
    return next()
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized access, Please send the correct token!' })
  }
};


app.use('/movies', movieRouter);
app.use('/', userRouter);

app.get('/', async (req, res) => {
  res.send('Welcome to User API.');
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(3000, () => {
  console.log('server started');
});
