import path from 'path'
import { existsSync } from 'fs'
import { mkdir, rm } from 'fs/promises'
import { randomBytes } from 'crypto'
import { User } from '../models'

const mimeTypes = {
  'image/png': '.png',
  'image/jpeg': '.jpeg',
  'image/gif': '.gif',
}

export const uploadPhoto = async (req, res, next) => {
  const { photo } = req.files
  const { userid, forProfile } = req.body
  try {
    const isForProfile = JSON.parse(forProfile)
    if (!(userid && photo && typeof(isForProfile) === 'boolean')) {
      return res.status(403).json('Invalid Request!')
    }
    const uid = userid.trim()
    const doc = await User.findById(uid)
    if (!doc) {
      return res.json({ error: { status: 404, statusCode: 404, message: 'No Such User!'} })
    }
    if (!photo) {
      return res.json({ error: { status: 400, statusCode: 400, message: 'No files to upload!'} })
    }
    if (!existsSync(path.join(__dirname, "..", "..", "public"))) {
      await mkdir(path.join(__dirname, "..", "..", "public"))
    }
    const files = []
    if (isForProfile) {
      // for profile photo
      const filetoupload = Array.isArray(photo) && photo.length > 1 ? photo[0] : photo
      const randomFilename = randomBytes(16).toString("hex") + mimeTypes[filetoupload.mimetype]
      const publicPath = `profile-photo/${uid}/${randomFilename}`
      if (!existsSync(path.join(__dirname, "..", "..", "public", 'profile-photo'))) {
        await mkdir(path.join(__dirname, "..", "..", "public", 'profile-photo'))
      }
      if (!existsSync(path.join(__dirname, "..", "..", "public", 'profile-photo', uid))) {
        await mkdir(path.join(__dirname, "..", "..", "public", 'profile-photo', uid))
      }
      const savePath = path.join(__dirname, "..", "..", "public", 'profile-photo', uid, randomFilename)
      await filetoupload.mv(savePath)
      files.push({
        filename: publicPath,
        mimetype: filetoupload.mimetype,
        file_extension: mimeTypes[filetoupload.mimetype],
        size: filetoupload.size
      })
    } else {
      // for messenger chat photo
      if (!existsSync(path.join(__dirname, "..", "..", "public", 'chat-photo'))) {
        await mkdir(path.join(__dirname, "..", "..", "public", 'chat-photo'))
      }
      if (!existsSync(path.join(__dirname, "..", "..", "public", 'chat-photo', uid))) {
        await mkdir(path.join(__dirname, "..", "..", "public", 'chat-photo', uid))
      }
      if (Array.isArray(photo)) { // multiple photos
        for (let filetoupload of photo) {
          const randomFilename = randomBytes(16).toString("hex") + mimeTypes[filetoupload.mimetype]
          const publicPath = `chat-photo/${uid}/${randomFilename}`
          const savePath = path.join(__dirname, "..", "..", "public", 'chat-photo', uid, randomFilename)
          await filetoupload.mv(savePath)
          files.push({
            filename: publicPath,
            mimetype: filetoupload.mimetype,
            file_extension: mimeTypes[filetoupload.mimetype],
            size: filetoupload.size
          })
        }
      } else { // single photo
        const randomFilename = randomBytes(16).toString("hex") + mimeTypes[photo.mimetype]
        const publicPath = `chat-photo/${uid}/${randomFilename}`
        const savePath = path.join(__dirname, "..", "..", "public", 'chat-photo', uid, randomFilename)
        await photo.mv(savePath)
        files.push({
          filename: publicPath,
          mimetype: photo.mimetype,
          file_extension: mimeTypes[photo.mimetype],
          size: photo.size
        })
      }
    }
    res.json({ success: { files, message: 'Photo Uploaded Sucessfully' } })
  } catch(error) {
    if (Array.isArray(photo)) {
      for (let tmpphoto of photo) {
        try { 
          await rm(tmpphoto.tempFilePath)
      } catch (e) {
        // skip
      }
      }
    } else {
      try {
        await rm(photo.tempFilePath)
      } catch (e) {
        // skip
      }
    }
    next(error)
  }
}