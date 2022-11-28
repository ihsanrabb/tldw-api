const { validationResult } = require('express-validator');
const User = require('../models/user');
const Customer = require('../models/customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { env, role } = require('../globals');

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({
      message: "InvalidParameter",
      errors: errors.array()
    });
  }

  const { email, password, name, phone_number, user_role } = req.body;
  try {
    if(user_role === role.CUSTOMER || user_role === role.TENANT) {
      const queryExistingEmail = await User.where({email}).findOne();
      if(queryExistingEmail) {
        return res.status(422).json({
          message: "Email exist",
          errors: "Email exist"
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      const newUser = new User({
        email,
        password: hashedPassword,
        role: role.CUSTOMER
      });
      await newUser.save();

      if(user_role === role.CUSTOMER) {
        const newCustomer = new Customer({
          name,
          phone_number,
          avatar_url: "",
          queue_list: [],
          owner: newUser._id
        });
        await newCustomer.save();
      }

      res.status(201).json({
        message: "User created!",
        userId: newUser._id
      });
    } else {
      return res.status(422).json({
        message: "InvalidParameter",
        errors: "Input valid role"
      });
    }
  } catch(err) {
    console.log("erros create user", err);
  }
}

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({
      message: "InvalidParameter",
      errors: errors.array()
    });
  }

  const { email, password } = req.body;
  try {
    const currentUser = await User.where({email}).findOne();
    if(!currentUser) {
      return res.status(401).json({
        message: "Email not found",
        errors: "Email not found"
      });
    }

    const checkPassword = bcrypt.compareSync(password, currentUser.password);
    if(!checkPassword) {
      return res.status(401).json({
        message: "Wrong password",
        errors: "Wrong password"
      });
    }
    
    const jwtToken = jwt.sign({
      email: currentUser.email,
      userId: currentUser._id,
    }, env.SECRET_KEY);

    res.status(200).json({
      message: "Login!",
      token: jwtToken,
      role: currentUser.role
    });
  } catch(err) {
    console.log('Error login user', err)
  }
}

exports.authrozie = async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(422).json({
      message: "InvalidParameter",
      errors: errors.array()
    });
  }
  
  const access_token = req.body.access_token;
  
  try {
    const decoded = jwt.verify(access_token, env.SECRET_KEY);
    console.log('decoded', decoded)
    res.status(200).json({
      message: "Access granted",
    });
  } catch(error) {
    res.status(401).json({
      error: "Unauthorized User",
      message: error.message
    });
  }
}

exports.translation = async(req, res) => {
  return res.status(200).json({
    learn: "Learn React",
    desc: "This is React way!"
  });
}
