// middleware.js
const { verifyRecaptcha } = require('./utils');

// Custom middleware to log requests
const requestLogger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

// Custom middleware to handle errors
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
};

// Middleware to verify Google reCAPTCHA token
const googleReCAPTCHA = async (req, res, next) => {
  const { recaptchaToken } = req.body;
  if (!recaptchaToken) return res.status(400).json({ message: 'reCAPTCHA token is required' });

  try {
    const isValid = await verifyRecaptcha(recaptchaToken);
    if (isValid) {
      next();
    } else {
      res.status(400).json({ message: 'Invalid reCAPTCHA token' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verifying reCAPTCHA', error });
  }
};

module.exports = { requestLogger, errorHandler, googleReCAPTCHA };
