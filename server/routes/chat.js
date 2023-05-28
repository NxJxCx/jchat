import express from 'express'
import * as chatController from '../controllers/chatController'

const router = express.Router()

router.get('/', chatController.getChatData)

export default router