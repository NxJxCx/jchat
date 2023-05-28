"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyPassword = exports.updateUserPassword = exports.updateUser = exports.updateOnlineStatus = exports.signupUser = exports.loginUser = exports.getUserByQuery = void 0;
var _models = require("../models");
var _bcryptjs = require("bcryptjs");
const updateOnlineStatus = async (req, res, next) => {
  const {
    userid
  } = req.body ? req.body : {};
  if (!userid) {
    return res.status(403).json('Invalid Request!');
  }
  try {
    const dateonline = new Date(Date.now());
    const doc = await _models.User.findByIdAndUpdate(userid, {
      $set: {
        dateonline
      }
    });
    if (!doc) {
      return res.json({
        error: {
          status: 500,
          statusCode: 500,
          message: 'Failed to update Online Status'
        }
      });
    }
    res.json({
      success: {
        message: 'Online Status Updated to ' + dateonline.getTime()
      }
    });
  } catch (error) {
    next(error);
  }
};
exports.updateOnlineStatus = updateOnlineStatus;
const loginUser = async (req, res, next) => {
  const {
    username,
    password
  } = req.body ? req.body : {};
  if (!(username && password)) {
    return res.status(403).json({
      error: {
        status: 403,
        statusCode: 403,
        message: 'Invalid Request!'
      }
    });
  }
  try {
    const result = await _models.User.findOne({
      username
    }).select('username password');
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
            status: 401,
            statusCode: 401,
            message: 'Invalid Username or Password!'
          }
        });
      }
    } else {
      // no username exists
      res.json({
        error: {
          status: 404,
          statusCode: 404,
          message: 'No Username Exists!'
        }
      });
    }
  } catch (error) {
    next(error);
  }
};
exports.loginUser = loginUser;
const signupUser = async (req, res, next) => {
  const {
    username,
    password,
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
  if (!(username && password && firstname && lastname && birthday && gender && civilstatus && photo)) {
    return res.status(403).json({
      error: {
        status: 403,
        statusCode: 403,
        message: 'Invalid Request!'
      }
    });
  }
  try {
    const password_hash = await (0, _bcryptjs.hash)(password, 12);
    const userModel = new _models.User({
      username,
      password: password_hash,
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
    console.log(result);
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
          status: 500,
          statusCode: 500,
          message: 'Failed to register user!'
        }
      });
    }
  } catch (error) {
    next(error);
  }
};
exports.signupUser = signupUser;
const getUserByQuery = async (req, res, next) => {
  const {
    query,
    username,
    search
  } = req.query ? req.query : {};
  try {
    switch (query) {
      case 'exists':
        {
          if (username) {
            const result = await _models.User.findOne({
              username
            }).select('username');
            if (result) {
              return res.json(true);
            } else {
              return res.json(false);
            }
          } else {
            return res.status(500).json({
              error: 'Invalid Request!'
            });
          }
        }
      case 'search':
        {
          const searchParams = {
            username: {
              $regex: search,
              $options: 'i'
            },
            firstname: {
              $regex: search,
              $options: 'i'
            },
            middlename: {
              $regex: search,
              $options: 'i'
            },
            lastname: {
              $regex: search,
              $options: 'i'
            }
          };
          const result = await _models.User.find(searchParams).select({
            _id: 0,
            username: 1,
            firstname: 1,
            middlename: 1,
            lastname: 1,
            gender: 1,
            civilstatus: 1,
            photo: 1
          });
          if (result) {
            return res.json([...result]);
          } else {
            return res.json([]);
          }
        }
      case 'profile':
        {
          const result = await _models.User.findOne({
            username
          }).select({
            _id: 0,
            username: 1,
            firstname: 1,
            middlename: 1,
            lastname: 1,
            birthday: 1,
            gender: 1,
            civilstatus: 1,
            address: 1,
            aboutme: 1,
            photo: 1
          });
          if (result) {
            return res.json({
              ...result
            });
          } else {
            return res.json(null);
          }
        }
      default:
        return res.status(403).json({
          error: 'Invalid Request!'
        });
    }
  } catch (error) {
    next(error);
  }
};
exports.getUserByQuery = getUserByQuery;
const updateUser = async (req, res, next) => {
  const userid = req.params ? req.params.userid : null;
  if (!userid) {
    return req.status(403).json('Invalid Request!');
  }
  const {
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
  if (!(firstname && lastname && birthday && gender && civilstatus && photo)) {
    return req.status(403).json('Invalid Request!');
  }
  try {
    const doc = await _models.User.findById(userid);
    if (doc) {
      [['firstname', firstname], ['middlename', middlename], ['lastname', lastname], ['birthday', birthday], ['gender', gender], ['civilstatus', civilstatus], ['address', address], ['aboutme', aboutme], ['photo', photo]].map(([key, value], i) => {
        doc[key] = value;
        return true;
      });
      const result = await doc.save();
      res.json({
        success: {
          userid: result._id,
          message: 'Successfully Updated!'
        }
      });
    } else {
      res.status(500).json({
        error: {
          message: 'No user found to update!'
        }
      });
    }
  } catch (error) {
    next(error);
  }
};
exports.updateUser = updateUser;
const updateUserPassword = async (req, res, next) => {
  const userid = req.params ? req.params.userid : null;
  if (!userid) {
    return req.status(403).json('Invalid Request!');
  }
  const {
    oldpassword,
    newpassword
  } = req.body ? req.body : {};
  if (!(oldpassword && newpassword)) {
    return req.status(403).json('Invalid Request!');
  }
  try {
    const doc = await _models.User.findById(userid);
    if (!doc) {
      return req.status(404).json('No Such User!');
    }
    const verified = await (0, _bcryptjs.compare)(oldpassword, doc.password);
    if (verified) {
      const password = (0, _bcryptjs.hash)(newpassword, 12);
      doc.password = password;
      const result = await doc.save();
      if (result) {
        res.json({
          success: {
            message: 'Successfully Changed Password!'
          }
        });
      } else {
        res.json({
          error: {
            status: 500,
            statusCode: 500,
            message: 'Failed to Change Password!'
          }
        });
      }
    } else {
      res.status(403).json('Invalid Password!');
    }
  } catch (error) {
    next(error);
  }
};
exports.updateUserPassword = updateUserPassword;
const verifyPassword = async (req, res, next) => {
  const userid = req.params ? req.params.userid : null;
  if (!userid) {
    return req.status(403).json('Invalid Request!');
  }
  const {
    password
  } = req.body ? req.body : {};
  if (!password) {
    return req.status(403).json('Invalid Request!');
  }
  try {
    const doc = await _models.User.findById(userid);
    if (!doc) {
      return req.status(404).json('No Such User!');
    }
    const result = await (0, _bcryptjs.compare)(password, doc.password);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
exports.verifyPassword = verifyPassword;