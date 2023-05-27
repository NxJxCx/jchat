"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyPassword = exports.updateUser = exports.signupUser = exports.loginUser = exports.getUserByQuery = void 0;
var _models = require("../models");
var _bcryptjs = require("bcryptjs");
const loginUser = async (req, res, next) => {
  const {
    username,
    password
  } = req.body ? req.body : {};
  if (!(username && password)) {
    return res.status(500).json({
      error: {
        status: 500,
        statusCode: 500,
        message: 'Invalid Request'
      }
    });
  }
  try {
    const result = await _models.User.find({
      username
    });
    if (result) {
      const isValid = await (0, _bcryptjs.compare)(password, result.password);
      if (isValid) {
        res.json({
          success: {
            userid: result._id,
            message: 'Successfully Logged In!'
          }
        });
      } else {
        res.json({
          error: {
            message: 'Invalid Username or Password!'
          }
        });
      }
    } else {
      // no username exists
      res.json({
        error: {
          message: 'No Username Exists!'
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      error
    });
  }
};
exports.loginUser = loginUser;
const signupUser = async (req, res, next) => {
  const {
    username,
    password,
    email,
    firstname,
    middlename,
    lastname,
    birthday,
    gender,
    civilstatus,
    address,
    aboutme,
    photo
  } = req.body ? req.body : {};
  if (!(username && password && email && firstname && lastname && birthday && gender && civilstatus && photo)) {
    return res.status(500).json({
      error: {
        status: 500,
        statusCode: 500,
        message: 'Invalid Request. Insufficient Required Fields.'
      }
    });
  }
  try {
    const password_hash = await (0, _bcryptjs.hash)(password, 12);
    const userModel = new _models.User({
      username,
      password: password_hash,
      email,
      firstname,
      middlename,
      lastname,
      birthday,
      gender,
      civilstatus,
      address,
      aboutme,
      photo
    });
    const result = await userModel.save();
    if (result) {
      res.json({
        success: {
          userid: result._id,
          message: 'Successfully Registered!'
        }
      });
    } else {
      res.json({
        error: {
          message: 'Failed to register user!'
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      error
    });
  }
};
exports.signupUser = signupUser;
const getUserByQuery = async (req, res, next) => {
  const {
    query,
    username,
    email
  } = req.query ? req.query : {};
};
exports.getUserByQuery = getUserByQuery;
const updateUser = async (req, res, next) => {};
exports.updateUser = updateUser;
const verifyPassword = async (req, res, next) => {};
exports.verifyPassword = verifyPassword;