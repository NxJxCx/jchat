import { User } from '../models'
import { hash, compare } from 'bcryptjs'

export const loginUser = async (req, res, next) => {
  const { username, password } = req.body ? req.body : {}
  if (!(username && password)) {
    return res.status(500).json({ error: { status: 500, statusCode: 500, message: 'Invalid Request' }})
  }
  try {
    const result = await User.find({ username })
    if (result) {
      const isValid = await compare(password, result.password)
      if (isValid) {
        res.json({ success: { userid: result._id, message: 'Successfully Logged In!' }})
      } else {
        res.json({ error: { message: 'Invalid Username or Password!' }})
      }
    } else {
      // no username exists
      res.json({ error: { message: 'No Username Exists!' }})
    }
    
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const signupUser = async (req, res, next) => {
  const {
    username, password, email,
    firstname, middlename, lastname,
    birthday, gender, civilstatus,
    address, aboutme, photo
  } = req.body ? req.body : {}
  if (!(username && password && email && firstname && lastname
      && birthday && gender && civilstatus && photo)) {
    return res.status(500).json({ error: { status: 500, statusCode: 500, message: 'Invalid Request. Insufficient Required Fields.' }})
  }
  try { 
    const password_hash = await hash(password, 12)
    const userModel = new User({
      username, password: password_hash, email,
      firstname, middlename, lastname,
      birthday, gender, civilstatus,
      address, aboutme, photo
    })
    const result = await userModel.save()
    if (result) {
      res.json({ success: { userid: result._id, message: 'Successfully Registered!'}})
    } else {
      res.json({ error: { message: 'Failed to register user!' }})
    }
  } catch (error) {
    res.status(500).json({ error })
  }
}

export const getUserByQuery = async (req, res, next) => {
  const { query, username, email } = req.query ? req.query : {}
  
}

export const updateUser = async (req, res, next) => {

}

export const verifyPassword= async (req, res, next) => {

}
