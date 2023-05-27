"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = require("mongoose");
const UserSchema = new _mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstname: {
    type: String,
    required: true
  },
  middlename: {
    type: String,
    default: ''
  },
  lastname: {
    type: String,
    required: true
  },
  birthday: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    default: 'Male'
  },
  civilstatus: {
    type: String,
    required: true,
    default: 'Single'
  },
  address: {
    type: String,
    default: ''
  },
  aboutme: {
    type: String,
    default: ''
  },
  photo: {
    type: String,
    required: true
  }
});
const User = (0, _mongoose.model)('User', UserSchema);
var _default = User;
exports.default = _default;