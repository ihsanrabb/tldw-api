const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { check } = require('express-validator');

const signUpValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is requried').isLength({ min: 6 }),
  check('name', 'Name is required').isLength({ min: 2 }),
  check('phone_number', 'Phone must be number').isNumeric()
];

const loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is requried').isLength({ min: 6 }),
];

const authorizeValidation = [
  check('access_token', 'access_token is required').isLength({ min: 2 })
];

router.post('/signup', signUpValidation, authController.signup);
router.post('/login', loginValidation, authController.login);
router.post('/authorize', authorizeValidation, authController.authrozie);
router.get('/translation', authController.translation);

module.exports = router;
