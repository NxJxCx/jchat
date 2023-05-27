import path from 'path'
import fs from 'fs'

export const uploadPhoto = async (req, res, next) => {
  const { photo } = req.files
  const { userid, forProfile } = req.body
  if (!(userid && photo && type(forProfile) === 'boolean')) {
    return res.status(403).json('Invalid Request!')
  }
  const doc = await User.findById(userid)
  if (!doc) {
    return res.status(404).json('No Such User!')
  }
  if (!file) {
    return res.status(400).json('No files to upload!')
  }
  if (forProfile) {
    
  } else {
    
  }
}