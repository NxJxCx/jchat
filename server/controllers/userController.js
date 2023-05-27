import { User } from '../models'
import { hash, compare } from 'bcryptjs'

export const loginUser = async (req, res, next) => {
  const { username, password } = req.body ? req.body : {}
  if (!(username && password)) {
    return res.status(403).json({ error: { status: 403, statusCode: 403, message: 'Invalid Request!' }})
  }
  try {
    const result = await User.findOne({ username }).select('username password')
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
    next(error)
  }
}

export const signupUser = async (req, res, next) => {
  const {
    username, password,
    firstname, middlename, lastname,
    birthday, gender, civilstatus,
    address, aboutme, photo
  } = req.body ? req.body : {}
  if (!(username && password && firstname && lastname
      && birthday && gender && civilstatus && photo)) {
    return res.status(403).json({ error: { status: 403, statusCode: 403, message: 'Invalid Request!' }})
  }
  try { 
    const password_hash = await hash(password, 12)
    const userModel = new User({
      username, password: password_hash,
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
    next(error)
  }
}

export const getUserByQuery = async (req, res, next) => {
  const { query, username, email, search } = req.query ? req.query : {}
  try {
    switch (query) {
      case 'exists': {
        if (username) {
          const result = await User.findOne({ username }).select('username')
          if (result) {
            res.json(true)
          } else {
            res.json(false)
          }
        } else {
          res.status(500).json({ error: 'Invalid Request!'})
        }
        break
      }
      case 'search': {
        const searchParams = {
          username: { $regex: search, $options: 'i' },
          firstname: { $regex: search, $options: 'i'},
          middlename: { $regex: search, $options: 'i' },
          lastname: { $regex: search, $options: 'i' },
        }
        const result = await User.find(searchParams).select({ _id: 0, username: 1, firstname: 1, middlename: 1, lastname: 1, gender: 1, civilstatus: 1, photo: 1 })
        if (result) {
          res.json(result)
        } else {
          res.json([])
        }
        break
      }
      case 'profile': {
        const result = await User.findOne({ username }).select({ _id: 0, username: 1, firstname: 1, middlename: 1, lastname: 1, birthday: 1, gender: 1, civilstatus: 1, address: 1, aboutme: 1, photo: 1 })
        if (result) {
          res.json(result)
        } else {
          res.json(null)
        }
        break
      }
      default:
        res.status(403).json({ error: 'Invalid Request!'})
    }
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req, res, next) => {
  const userid = req.params ? req.params.userid : null;
  if (!userid) {
    return req.status(403).json('Invalid Request!')
  }
  const { firstname, middlename, lastname, birthday, gender, civilstatus, address, aboutme, photo } = req.body ? req.body : {}
  if (!(firstname && lastname && birthday && gender && civilstatus && photo)) {
    return req.status(403).json('Invalid Request!')
  }
  try {
    const doc = await User.findById(userid)
    if (doc) {
      [['firstname', firstname], ['middlename', middlename], ['lastname', lastname], ['birthday', birthday], ['gender', gender], ['civilstatus', civilstatus], ['address', address], ['aboutme', aboutme], ['photo', photo]].map(([key, value], i) => {
        doc[key] = value
        return true
      })
      const result = await doc.save()
      res.json({ success: { userid: result._id, message: 'Successfully Updated!' }})
    } else {
      res.status(500).json({ error: { message: 'No user found to update!'}})
    }
  } catch (error) {
    next(error)
  }
}

export const updateUserPassword = async (req, res, next) => {
  const userid = req.params ? req.params.userid : null;
  if (!userid) {
    return req.status(403).json('Invalid Request!')
  }
  const { oldpassword, newpassword } = req.body ? req.body : {}
  if (!(oldpassword && newpassword)) {
    return req.status(403).json('Invalid Request!')
  }
  try {
    const doc = await User.findById(userid)
    if (!doc) {
      return req.status(404).json('No Such User!')
    }
    const verified = await compare(oldpassword, doc.password)
    if (verified) {
      const password = hash(newpassword, 12)
      doc.password = password
      const result = await doc.save()
      if (result) {
        res.json({ success: { message: 'Successfully Changed Password!' }})
      } else {
        res.json({ error: { message: 'Failed to Change Password!'}})
      }
    } else {
      res.status(403).json('Invalid Password!')
    }
  } catch (error) {
    next(error)
  }
}

export const verifyPassword = async (req, res, next) => {
  const userid = req.params ? req.params.userid : null;
  if (!userid) {
    return req.status(403).json('Invalid Request!')
  }
  const { password } = req.body ? req.body : {}
  if (!password) {
    return req.status(403).json('Invalid Request!')
  }
  try {
    const doc = await User.findById(userid)
    if (!doc) {
      return req.status(404).json('No Such User!')
    }
    const result = await compare(password, doc.password)
    res.json(result)
  } catch (error) {
    next(error)
  }
}
