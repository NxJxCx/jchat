"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadPhoto = void 0;
var _path = _interopRequireDefault(require("path"));
var _fs = require("fs");
var _promises = require("fs/promises");
var _crypto = require("crypto");
var _models = require("../models");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const mimeTypes = {
  'image/png': '.png',
  'image/jpeg': '.jpeg',
  'image/gif': '.gif'
};
const uploadPhoto = async (req, res, next) => {
  const {
    photo
  } = req.files;
  const {
    userid,
    forProfile
  } = req.body;
  try {
    const isForProfile = JSON.parse(forProfile);
    if (!(userid && photo && typeof isForProfile === 'boolean')) {
      return res.status(403).json('Invalid Request!');
    }
    const uid = userid.trim();
    const doc = await _models.User.findById(uid);
    if (!doc) {
      return res.json({
        error: {
          status: 404,
          statusCode: 404,
          message: 'No Such User!'
        }
      });
    }
    if (!photo) {
      return res.json({
        error: {
          status: 400,
          statusCode: 400,
          message: 'No files to upload!'
        }
      });
    }
    if (!(0, _fs.existsSync)(_path.default.join(__dirname, "..", "..", "public"))) {
      await (0, _promises.mkdir)(_path.default.join(__dirname, "..", "..", "public"));
    }
    const files = [];
    if (isForProfile) {
      // for profile photo
      const filetoupload = Array.isArray(photo) && photo.length > 1 ? photo[0] : photo;
      const randomFilename = (0, _crypto.randomBytes)(16).toString("hex") + mimeTypes[filetoupload.mimetype];
      const publicPath = `profile-photo/${uid}/${randomFilename}`;
      if (!(0, _fs.existsSync)(_path.default.join(__dirname, "..", "..", "public", 'profile-photo'))) {
        await (0, _promises.mkdir)(_path.default.join(__dirname, "..", "..", "public", 'profile-photo'));
      }
      if (!(0, _fs.existsSync)(_path.default.join(__dirname, "..", "..", "public", 'profile-photo', uid))) {
        await (0, _promises.mkdir)(_path.default.join(__dirname, "..", "..", "public", 'profile-photo', uid));
      }
      const savePath = _path.default.join(__dirname, "..", "..", "public", 'profile-photo', uid, randomFilename);
      await filetoupload.mv(savePath);
      files.push({
        filename: publicPath,
        mimetype: filetoupload.mimetype,
        file_extension: mimeTypes[filetoupload.mimetype],
        size: filetoupload.size
      });
    } else {
      // for messenger chat photo
      if (!(0, _fs.existsSync)(_path.default.join(__dirname, "..", "..", "public", 'chat-photo'))) {
        await (0, _promises.mkdir)(_path.default.join(__dirname, "..", "..", "public", 'chat-photo'));
      }
      if (!(0, _fs.existsSync)(_path.default.join(__dirname, "..", "..", "public", 'chat-photo', uid))) {
        await (0, _promises.mkdir)(_path.default.join(__dirname, "..", "..", "public", 'chat-photo', uid));
      }
      if (Array.isArray(photo)) {
        // multiple photos
        for (let filetoupload of photo) {
          const randomFilename = (0, _crypto.randomBytes)(16).toString("hex") + mimeTypes[filetoupload.mimetype];
          const publicPath = `chat-photo/${uid}/${randomFilename}`;
          const savePath = _path.default.join(__dirname, "..", "..", "public", 'chat-photo', uid, randomFilename);
          await filetoupload.mv(savePath);
          files.push({
            filename: publicPath,
            mimetype: filetoupload.mimetype,
            file_extension: mimeTypes[filetoupload.mimetype],
            size: filetoupload.size
          });
        }
      } else {
        // single photo
        const randomFilename = (0, _crypto.randomBytes)(16).toString("hex") + mimeTypes[photo.mimetype];
        const publicPath = `chat-photo/${uid}/${randomFilename}`;
        const savePath = _path.default.join(__dirname, "..", "..", "public", 'chat-photo', uid, randomFilename);
        await photo.mv(savePath);
        files.push({
          filename: publicPath,
          mimetype: photo.mimetype,
          file_extension: mimeTypes[photo.mimetype],
          size: photo.size
        });
      }
    }
    res.json({
      success: {
        files,
        message: 'Photo Uploaded Sucessfully'
      }
    });
  } catch (error) {
    if (Array.isArray(photo)) {
      for (let tmpphoto of photo) {
        try {
          await (0, _promises.rm)(tmpphoto.tempFilePath);
        } catch (e) {
          // skip
        }
      }
    } else {
      try {
        await (0, _promises.rm)(photo.tempFilePath);
      } catch (e) {
        // skip
      }
    }
    next(error);
  }
};
exports.uploadPhoto = uploadPhoto;