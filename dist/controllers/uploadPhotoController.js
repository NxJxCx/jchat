"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadPhoto = void 0;
var _path = _interopRequireDefault(require("path"));
var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const uploadPhoto = async (req, res, next) => {
  const files = req.files;
  console.log("FILES", files);
  console.log("BODY", req.body);
  // if (!(userid && file && type(forProfile) === 'boolean')) {
  //   return res.status(403).json('Invalid Request!')
  // }
  // const doc = await User.findById(userid)
  // if (!doc) {
  //   return res.status(404).json('No Such User!')
  // }
  // if (!file) {
  //   return res.status(400).json('No files to upload!')
  // }
  // if (forProfile) {

  // } else {

  // }
  res.json({
    files
  });
};
exports.uploadPhoto = uploadPhoto;