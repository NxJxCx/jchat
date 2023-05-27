import path from 'path'
import fs from 'fs'

export const uploadPhoto = async (req, res, next) => {
  const { photo } = req.files
  const { userid, forProfile } = req.body
  try {
    const isForProfile = JSON.parse(forProfile)
    console.log(userid, photo, typeof(isForProfile))
    if (!(userid && photo && typeof(isForProfile) === 'boolean')) {
      return res.status(403).json('Invalid Request!')
    }
    const doc = await User.findById(userid)
    if (!doc) {
      return res.status(404).json('No Such User!')
    }
    if (!photo) {
      return res.status(400).json('No files to upload!')
    }
    console.log(photo)
    if (isForProfile) {
      
    } else {
      
    }
    res.json({ success: 'OK'})
  } catch(error) {
    res.status(500).json({ error })
  }
 
}