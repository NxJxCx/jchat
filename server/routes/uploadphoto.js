import express from 'express'
import * as uploadPhotoController from '../controllers/uploadPhotoController'

const router = express.Router()

router.post('/', uploadPhotoController.uploadPhoto)

export default router