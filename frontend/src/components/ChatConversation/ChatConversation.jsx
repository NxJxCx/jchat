import { useState, useEffect } from 'react'
import ChatMessageContent from "./ChatMessageContent";
import { getChatData, getChatConversation, getUserById, getUserByUsername } from '../../api';

export default function ChatConversation({ chatid, userid, username }) {
  const [chat_id, setChatId] = useState(null)
  const [data, setData] = useState([])
  const [myUser, setMyUser] = useState(null)
  const [otherUser, setOtherUser] = useState(null)
  const handleOpenPhotos = (photo, i, photos) => {
    console.log(photo, i, photos)
  }

  useEffect(() => {
    if (myUser === null && userid) {
        getUserById(userid)
        .then(resp => new Promise((res, rej)=>resp.data ? res(resp.data) : rej('Invalid chat data')))
        .then((myuserinfo) => setMyUser(myuserinfo))
        .catch(err => { setMyUser(null); console.log(err) })
    }
    if (otherUser === null && userid) {
      if (chatid) {
        getChatData(userid)
        .then(resp => new Promise(res=>res(resp.data)))
        .then(({success, error}) => new Promise((res, rej)=>
          success ? res(success.data.filter(v => v._id.toString() === chatid).pop()) : rej(error)
        ))
        .then(chatdata =>
          chatdata
          ? getUserById(chatdata.users.map(v => v._id).filter(uid => uid !== userid).pop() || '')
            .then(resp => new Promise(res=>res(resp.data)))
          : (function(){throw new Error('Invalid chat data')})()
        )
        .then(userinfo => setOtherUser(userinfo))
        .catch(err => { setOtherUser(null); console.log(err) })
      } else if (username){
        getUserByUsername(username)
        .then(resp => new Promise(res => res(resp.data)))
        .then(userinfo => setOtherUser(userinfo))
        .catch(err => { setOtherUser(null); console.log(err) })
      } else {
        setOtherUser(null)
      }
    }
  }, [chatid, userid, username, myUser, otherUser])

  useEffect(() => {
    if (chat_id === null && chatid && userid && myUser !== null && otherUser !== null) {
      getChatData(userid)
      .then(resp => new Promise(res=>res(resp.data)))
      .then(({success, error}) => new Promise((res, rej)=>
        success
        ? res(success.data.filter(v => v._id.toString() === chatid).length === 0)
        : rej(error)
      ))
      .then(isValid => isValid ? setChatId(chatid) : setChatId(null))
      .catch(error => { setChatId(null); console.log(error) } )
    } else if (chat_id === null && !chatid && myUser !== null && otherUser !== null) {
      getChatData(userid)
      .then(resp => new Promise(res=>res(resp.data)))
      .then(({success, error}) => new Promise((res, rej) => {
        if (success) {
          res(success.data.map(v =>
            v.users
            .map(v => v._id.toString() === myUser._id.toString() || v._id.toString() === otherUser._id.toString())
            .filter(v => v === true).length === 2 ? v._id.toString() : false)
          .filter(v => v !== false).join(''))
        } else {
          rej(error)
        }
      }))
      .then(cid => cid.length === 24 && setChatId(cid))
      .catch(error => { setChatId(null); console.log(error) })
    }
  }, [chat_id, chatid, userid, myUser, otherUser])

  useEffect(() => {
    const func = async () => {
      if (chat_id && chat_id.length === 24) {
        // get the chat conversation data
        getChatConversation(chat_id, myUser._id.toString())
        .then(resp => new Promise(res=>res(resp.data)))
        .then(({success}) => success && chat_id === success.chatid.toString()
          ? setData(success.data.map((v, i, dt) => {
            const isphotosnext = i < dt.length - 1 ? dt[i+1].photos.length > 0 : false
            const name = v.senderid.toString() === myUser._id.toString() ? `${myUser.firstname} ${myUser.lastname}` : (v.senderid.toString() === otherUser._id.toString() ? `${otherUser.firstname} ${otherUser.lastname}` : '')
            const profilephoto = v.senderid.toString() === myUser._id.toString() ? myUser.photo : (v.senderid.toString() === otherUser._id.toString() ? otherUser.photo : '')
            const previous = i < dt.length - 1 ? v.senderid.toString() === dt[i+1].senderid.toString() && (v.photos.length === 0 || !isphotosnext) : false
            const right = data[i].senderid.toString() === myUser._id.toString()
            return {
              name,
              profilephoto,
              previous,
              right,
              message: dt[i].message,
              time: new Date(dt[i].timestamp),
              photos: [...dt[i].photos],
              onClick: handleOpenPhotos,
            }
          }))
          : (function(){throw new Error('Invalid chat data')})())
        .catch(error => { setData([]); console.log(error) })
      } else {
        data.length > 0 && setData([])
      }
      return setTimeout(func, 1000)
    }
    const interval = setTimeout(func, 1000)
    return () => clearInterval(interval)
  }, [])

  return (<>
    { data.length > 0
      ? data.map((v, i) => <ChatMessageContent key={`convo_${chat_id}_${i}`} {...v} />).reverse()
      : <div className="chat-conversation">
          <div className="no-conversation">No messages. Send a message to start chatting.</div>
        </div> }
  </>);
}