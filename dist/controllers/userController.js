"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loginUser = exports.getAllUsers = void 0;
var _models = require("../models");
const loginUser = async (req, res, next) => {};
exports.loginUser = loginUser;
const getAllUsers = async (req, res, next) => {
  try {
    const data = await _models.User.find();
    res.send({
      name: 'User Route',
      data
    });
  } catch (err) {
    next(err);
  }
};
exports.getAllUsers = getAllUsers;