import { User, Chat } from '../models'
import { Types } from 'mongoose'

const ObjectId = Types.ObjectId

async function initializeChat(userIdA, userIdB) {
  return new Promise((resolve, _) => {
    const newchat = new Chat({
      users: [{ id: userIdA }, { id: userIdB }],
      conversation: [],
      lastestUpdate: {},
      lastUpdated: 0
    })
    newchat.save().then((doc) => {
      if (!doc) {
        resolve(false)
      }
      resolve(doc)
    }).catch(() => resolve(false))
  })
}

async function getObjectIdsBySearch(myid, search) {
  return new Promise((resolve, _) => {
    const searchParams = {
      username: { $regex: search, $options: 'i' },
      firstname: { $regex: search, $options: 'i'},
      middlename: { $regex: search, $options: 'i' },
      lastname: { $regex: search, $options: 'i' },
    }
    User.find(searchParams).$where(function() {
      return myid !== this._id.toString()
    }).select({ _id: 1 }).then(docs => {
      const result = [...docs].map(v => v._id)
      if (result.length === 0) {
        resolve(false)
      }
      resolve(result)
    }).catch(() => resolve(false))
  })
}

export const getChatData = async (req, res, next) => {
  const { query, from_user, to_user, chatid } = req.query ? req.query : {}
  try {
    switch (query) {
      case 'conversation': {
        if (!chatid && !from_user) {
          return res.status(403).json('Invalid Request!')
        }
        const chatdoc = await Chat.findById(chatid).select('users conversation')
        if (!chatdoc) {
          return res.status(403).json('Invalid Request!')
        }
        const hasUserId = chatdoc.users.filter(({id}) => id.toString() === from_user).length === 1
        if (!hasUserId) {
          return res.status(403).json('Invalid Request!')
        }
        // update seen
        const myuserindex = [...chatdoc.users].map(({id}, i) => id.toString() === from_user ? i : null).filter(v => v !== null)[0]
        chatdoc.users[myuserindex].seenLatest = true
        await chatdoc.save()
        const sortedConversation = [...chatdoc.conversation].sort((a, b) => b.getTime() - a.getTime())
        return res.json({
          success: {
            data: sortedConversation,
            message: 'Chat Conversation Received!',
            chatid: chatdoc._id
          }
        })
      }
      case 'search': {
        if (!from_user && !to_user) {
          return res.status(403).json('Invalid Request!')
        }
        const to_userids = await getObjectIdsBySearch(from_user, to_user)
        if (!to_userids) {
          return res.json({ success: { data: [], message: 'No Users Found' }})
        }
        const chatdocs = await Chat.find().$where(function() {
          const chatmodel = this
          const userids = chatmodel.users.map(({id}) => id)
          const otheruseridindex = userids.includes(ObjectId(from_user)) ? chatmodel.users[1 - userids.indexOf(ObjectId(from_user))] : -1
          if (otheruseridindex === -1) {
            return false
          }
          return to_userids.some(v => v.toString() === userids[otheruseridindex].toString()) && chatmodel.lastUpdated > 0
        }).select('users latestUpdate').sort({lastUpdated: -1})
        if (!chatdocs) {
          return res.json({ success: { data: [], message: 'No Users Found' }})
        }
        return res.json({ success: {
          data: [...chatdocs],
          message: `${chatdocs.length} Chat Conversations Found`
        }})
      }
      case 'chatids': {
        if (!from_user) {
          return res.status(403).json('Invalid Request!')
        }
        const chatdocs = await Chat.find().$where(function() {
          const userids = this.users.map(({id}) => id)
          return userids.includes(ObjectId(from_user)) && this.lastUpdated > 0
        }).select('users latestUpdate').sort({lastUpdated: -1})
        if (!chatdocs) {
          return res.json({ success: { data: [], message: 'No Users Found' }})
        }
        return res.json({ success: {
          data: [...chatdocs],
          message: `${chatdocs.length} Chat Conversations Found`
        }})
      }
      default:
        return res.status(403).json('Invalid Request!')
    }
  } catch (error) {
    next(error)
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
      senderdoc = await User.findById(from_userid).select('username firstname lastname')
      receiverdoc = await User.findOne({ username: to_username}).select('username')
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
    senderdoc = senderdoc ? senderdoc : await User.findById(from_id).select('username firstname lastname')
    receiverdoc = receiverdoc ? receiverdoc : await User.findOne({ username: to_username }).select('username')
    const prevConversation = chat.conversations
    const conversationId = ObjectId()
    if (typeof(message) === "string") {
      // save normal message chat
      prevConversation.push({
        id: conversationId,
        timestamp: datenow,
        senderid: senderdoc._id,
        message
      })
      chat.conversation = prevConversation
      chat.latestUpdate = {
        timestamp: datenow,
        sendername: `${senderdoc.firstname} ${senderdoc.lastname}`,
        message: message.substring(0, message.length > 15 ? 15 : message.length) + (message.length > 15 ? '...' : '')
      }
      chat.lastUpdated = datenow.getTime()
      for (let i in chat.users) {
        chat.users[i].seenLatest = chat.users[i].id.toString() === from_userid
      }
    } else if (Array.isArray(photos) && photos.length > 0) {
      // save photos path instead
      prevConversation.push({
        id: conversationId,
        timestamp: datenow,
        senderid: senderdoc._id,
        message: photos.length > 1 ? 'Sent photos' : 'Sent a photo',
        photos: [...photos]
      })
      chat.conversation = prevConversation
      chat.latestUpdate = {
        timestamp: datenow,
        sendername: `${senderdoc.firstname} ${senderdoc.lastname}`,
        message: photos.length > 1 ? 'Sent photos' : 'Sent a photo'
      }
      chat.lastUpdated = datenow.getTime()
      for (let i in chat.users) {
        chat.users[i].seenLatest = chat.users[i].id.toString() === from_userid
      }
    } else {
      return res.json({ error: { status: 500, statusCode: 500, message: 'Something went wrong. Please Try Again.' }})
    }
    // then save to database
    await chat.save()
    return res.json({ success: { message: 'Successfully Sent Chat!' }})
  } catch (error) {
    next(error)
  }
}