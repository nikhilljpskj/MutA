const db = require('../config/db');
const bcrypt = require('bcryptjs');
const fetch = require('node-fetch');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Register Controller
exports.register = async (req, res) => {
  const { name, email, phone, address, password, recaptchaToken } = req.body;

  // Verify reCAPTCHA token
  const secretKey = '6LdciEgqAAAAAJGCV_0TqCtfByRz7k2l7qBwXhRm';  // Replace with your reCAPTCHA secret key
  const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`, {
    method: 'POST',
  });
  const data = await response.json();

  if (!data.success) {
    return res.status(400).send({ message: 'reCAPTCHA verification failed' });
  }

  // Hash the password before saving
  const hashedPassword = bcrypt.hashSync(password, 10);
  const isAdmin = 2; // Default value for is_admin

  const sql = 'INSERT INTO users (name, email, phone, address, password, is_admin) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [name, email, phone, address, hashedPassword, isAdmin], (err, result) => {
    if (err) {
      console.error('Error during registration:', err);
      return res.status(500).send({ message: 'Error registering user' });
    }
    res.status(200).send({ message: 'User registered successfully' });
  });
};

// Login Controller
exports.login = (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(401).send({ success: false, message: 'User not found' });

    const user = result[0];
    const passwordMatch = bcrypt.compareSync(password, user.password); // Compare password using bcrypt
    if (!passwordMatch) return res.status(401).send({ success: false, message: 'Invalid credentials' });

    // Return the user data including the is_admin field
    req.session.user = user; // Store user in session
    res.status(200).send({ success: true, message: 'Login successful', user });
  });
};

// Logout Controller
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: 'Logout successful' });
  });
};

// Google OAuth Controller using Passport.js
passport.use(
  new GoogleStrategy(
    {
      clientID: '743701796177-omdirq2r4vtlpmm83m69q4i2msvp1n5p.apps.googleusercontent.com', // Replace with your Google client ID
      clientSecret: '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', // Replace with your Google client secret
      callbackURL: '/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      const { name, email } = profile._json;

      const sql = 'SELECT * FROM users WHERE email = ?';
      db.query(sql, [email], (err, result) => {
        if (err) return done(err);

        if (result.length === 0) {
          const sqlInsert = 'INSERT INTO users (name, email, is_admin) VALUES (?, ?, ?)';
          db.query(sqlInsert, [name, email, 2], (err, result) => {
            if (err) return done(err);
            return done(null, { id: result.insertId, name, email });
          });
        } else {
          return done(null, result[0]); // Return the existing user
        }
      });
    }
  )
);

// Google OAuth Token-Based Login
exports.googleOAuth = async (req, res) => {
  const { tokenId } = req.body;

  // Verify Google token with Google's OAuth 2.0 API
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${tokenId}`);
  const userData = await response.json();

  if (userData.error) {
    return res.status(400).send({ message: 'Invalid Google token' });
  }

  // Extract user details
  const { name, email } = userData;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.length === 0) {
      // If user doesn't exist, insert a new user
      const sqlInsert = 'INSERT INTO users (name, email, is_admin) VALUES (?, ?, ?)';
      db.query(sqlInsert, [name, email, 2], (err, result) => {
        if (err) return res.status(500).send(err);

        // Save user details in session
        req.session.user = { id: result.insertId, name, email, is_admin: 2 };

        // Send a success response
        return res.status(201).send({ message: 'User created and logged in successfully', user: req.session.user });
      });
    } else {
      // If user already exists, save details in session
      req.session.user = { id: result[0].id, name: result[0].name, email: result[0].email, is_admin: result[0].is_admin };

      // Send a success response
      return res.status(200).send({ message: 'User logged in successfully', user: req.session.user });
    }
  });
};

// Current User Controller
exports.getCurrentUser = (req, res) => {
  if (!req.session.user) {
    return res.status(401).send({ success: false, message: 'Not authenticated' });
  }
  res.status(200).send({ success: true, user: req.session.user });
};
