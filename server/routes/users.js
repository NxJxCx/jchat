import express from 'express'
import * as userController from '../controllers/userController'

const router = express.Router()


/* login user */
router.post('/login', userController.loginUser)

/* signup user */
router.post('/', userController.signupUser)

/* GET user by query */
router.get('/', userController.getUserByQuery)

/* update user */
router.put('/:userid', userController.updateUser)

/* verify user password */
router.post('/:userid/verifypassword', userController.verifyPassword)


export default router
