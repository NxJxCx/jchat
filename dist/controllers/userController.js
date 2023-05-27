"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllUsers = void 0;
var _models = require("../models");
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