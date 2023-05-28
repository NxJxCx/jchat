import path from 'path'
import { existsSync } from 'fs'
import { mkdir } from 'fs/promises'
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
    // const doc = await User.findById(userid)
    // if (!doc) {
    //   console.log("no such user!")
    //   return res.json({ error: { status: 404, statusCode: 404, message: 'No Such User!'} })
    // }
    if (!photo) {
      return res.json({ error: { status: 400, statusCode: 400, message: 'No files to upload!'} })
    }
    console.log(photo)
    const files = []
    console.log("IS FOR PROOFILE?", isForProfile)
    if (isForProfile) {
      // for profile photo
      const filetoupload = Array.isArray(photo) && photo.length > 1
                            ? photo[0] : photo
      const randomFilename = filetoupload.md5 + mimeTypes[filetoupload.mimetype]
      const publicPath = `profile-photo/${userid}/${randomFilename}`
      const dirExists = existsSync(path.join(__dirname, "..", "..", "public", 'profile-photo', userid))
      if (!dirExists) {
        await mkdir(path.join(__dirname, "..", "..", "public", 'profile-photo', userid))
      }
      const savePath = path.join(__dirname, "..", "..", "public", 'profile-photo', userid, randomFilename)
      const result = await filetoupload.mv(savePath)
      files.append({
        filename: publicPath,
        mimetype: filetoupload.mimetype,
        file_extension: mimeTypes[filetoupload.mimetype],
        size: filetoupload.size
      })
      console.log("RESULT:", result)
    } else {
      // for messenger chat photo
      if (Array.isArray(photo)) { // multiple photos
        for (let filetoupload of photo) {
          const randomFilename = filetoupload.md5 + mimeTypes[filetoupload.mimetype]
          const publicPath = `chat-photo/${userid}/${randomFilename}`
          const dirExists = existsSync(path.join(__dirname, "..", "..", "public", 'chat-photo', userid))
          if (!dirExists) {
            await mkdir(path.join(__dirname, "..", "..", "public", 'chat-photo', userid))
          }
          const savePath = path.join(__dirname, "..", "..", "public", 'chat-photo', userid, randomFilename)
          const result = await filetoupload.mv(savePath)
          files.append({
            filename: publicPath,
            mimetype: filetoupload.mimetype,
            file_extension: mimeTypes[filetoupload.mimetype],
            size: filetoupload.size
          })
          console.log("RESULT:", result)
        }
      } else { // single photo
        const randomFilename = photo.md5 + mimeTypes[photo.mimetype]
        const publicPath = `chat-photo/${userid}/${randomFilename}`
        const dirExists = existsSync(path.join(__dirname, "..", "..", "public", 'chat-photo', userid))
        if (!dirExists) {
          await mkdir(path.join(__dirname, "..", "..", "public", 'chat-photo', userid))
        }
        const savePath = path.join(__dirname, "..", "..", "public", 'chat-photo', userid, randomFilename)
        const result = await filetoupload.mv(savePath)
        files.append({
          filename: publicPath,
          mimetype: photo.mimetype,
          file_extension: mimeTypes[photo.mimetype],
          size: photo.size
        })
        console.log("RESULT:", result)
      }
    }
    res.json({ success: { files, message: 'Photo Uploaded Sucessfully' } })
  } catch(error) {
    next(error)
  }
}