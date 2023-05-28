import { User, Chat } from '../models'

async function initializeChat(userIdA, userIdB) {
  return new Promise((resolve, _) => {
    const newchat = new Chat({
      users: [userIdA, userIdB],
      conversation: [],
      lastestUpdate: {}
    })
    newchat.save().then((doc) => {
      if (!doc) {
        resolve(false)
      }
      resolve(doc)
    }).catch(() => resolve(false))
  })
}

export const getChatData = async (req, res, next) => {
  const { query, from_user, to_user } = req.query ? req.query : {}
  switch (query) {
    case 'chatdata': {
      if (!from_user && !to_user) {
        return res.status(403).json('Invalid Request!')
      }
      
    }
    default:
      return res.status(403).json('Invalid Request!')
  }
}

export const sendChat = async (req, res, next) => {
  const { chatid, from_userid, to_username, message, photos } = req.body ? req.body : {}
  if (!from_userid && !to_username && (!message || !photos)) {
    return res.status(403).json('Invalid Request!')
  }
  let chat = false
  let senderdoc = null
  let receiverdoc = null
  try {
    if (!chatid) {
      senderdoc = await User.findById(from_userid).select('username firstname middlename lastname')
      receiverdoc = await User.findOne({ username: to_username}).select('username firstname middlename lastname')
      if (!(senderdoc && receiverdoc && (senderdoc.username !== receiverdoc.username))) {
        return res.status(500).json('Invalid Request!')
      }
      chat = await initializeChat(senderdoc._id, receiverdoc._id)
    } else {
      chat = await Chat.findById(chatid)
    }
    
    if (!chat) {
      return res.status(500).json('Invalid Request!')
    }
    const datenow = new Date(Date.now())
    senderdoc = senderdoc ? senderdoc : await User.findById(from_id).select('username firstname middlename lastname')
    receiverdoc = receiverdoc ? receiverdoc : await User.findOne({ username: to_username }).select('username firstname middlename lastname')
    const prevConversation = chat.conversations
    if (typeof(message) === "string") {
      // save normal message chat
      prevConversation.push({
        timestamp: datenow,
        senderid: senderdoc._id,
        message
      })
      chat.conversation = prevConversation
      chat.latestUpdate = {
        timestamp: datenow,
        sendername: `${sendername.firstname} ${sendername.lastname}`,
        message: message.substring(0, message.length > 15 ? 15 : message.length) + (message.length > 15 ? '...' : '')
      }
    } else if (Array.isArray(photos)) {
      // save photos path instead
      // save normal message chat
      prevConversation.push({
        timestamp: datenow,
        senderid: senderdoc._id,
        message: photos.length > 1 ? 'Sent photos' : 'Sent a photo',
        photos: [...photos]
      })
      chat.conversation = prevConversation
      chat.latestUpdate = {
        timestamp: datenow,
        sendername: `${sendername.firstname} ${sendername.lastname}`,
        message: photos.length > 1 ? 'Sent photos' : 'Sent a photo'
      }
    } else {
      return res.json({ error: { status: 500, statusCode: 500, message: 'Something went wrong. Please Try Again.'}})
    }
  } catch (error) {
    next(error)
  }
  
}