import { useState, useEffect } from 'react'
import { NavLink, useLoaderData, Outlet, useNavigate } from 'react-router-dom'
import * as Icons from 'react-bootstrap-icons'
import './Chat.css'
import ChatContactGroup from '../ChatContact/ChatContactGroup'

import { getUsersBySearch, getUserById, getChatSearchData, getChatData, updateOnlineStatus, getChatConversation } from '../../api'

export default function Chat() {
  const { logininfo } = useLoaderData()
  const navigate = useNavigate()
  const [myUser, setMyUser] = useState(null)
  const [userContacts, setUserContacts] = useState({})
  const [initContactIndex, setInitContactIndex] = useState(-1)
  
  const [searchName, setSearchName] = useState('')

  useEffect(() => {
    window.addEventListener("focus", () => {
      updateOnlineStatus(logininfo.userid)
      .catch(err => console.log(err));
    }, false)
  }, [logininfo])

  useEffect(() => {
    if (myUser === null) {
      getUserById(logininfo.userid)
      .then(resp => new Promise(res => res(resp.data)))
      .then(setMyUser)
      .catch(error => { setMyUser(null); console.log(error) })
    }
  }, [myUser, logininfo.userid])

  useEffect(() => {
    if (logininfo.userid) {
      if (searchName.length > 0) {
        getChatSearchData(logininfo.userid, searchName)
        .then(resp => new Promise(res=> res(resp.data.success)))
        .then(success=> new Promise(async (res)=> {
          const resultdata = []
          for (let i = 0; i < success.data.length; i++) {
            let v = success.data[i]
            const otherid = v.users.filter(vf => vf._id.toString() !== logininfo.userid).pop()._id.toString()
            const resp = await getUserById(otherid)
            const rs = resp.data
            resultdata.push({...v, name: rs.firstname + ' ' + rs.lastname, username: rs.username, photo: rs.photo, dateonline: rs.dateonline })
          }
          res(setUserContacts({ chats: [...resultdata], users: [] }))
        }))
        .then(() => getUsersBySearch(searchName))
        .then(resp => new Promise(res=>res(resp.data)))
        .then(dt => setUserContacts({ users: [...dt], chats: [...userContacts.chats] }))
        .catch(error => { setUserContacts({ chats: [], users: [] }); console.log(error) })
        
      } else {
        getChatData(logininfo.userid)
        .then(resp => new Promise(res=> res(resp.data.success)))
        .then(async (success) => {
          if (success.data.length > 0) {
            if (window.location.pathname === '/' || (window.location.pathname.substring(0, 6) === '/chat/' && window.location.pathname.substring(6, 13) === 'message/')) {
              navigate('/chat/' + success.data[0]._id.toString())
            } else {
              success.data.forEach((v, i)=> {
                if (v._id.toString() === window.location.pathname.substring(6, 24+6)) {
                  setInitContactIndex(i)
                }
              })
            }
          }
          const resultdata = []
          for (let i = 0; i < success.data.length; i++) {
            let v = success.data[i]
            const otherid = v.users.filter(vf => vf._id.toString() !== logininfo.userid).pop()._id.toString()
            const resp = await getUserById(otherid)
            const rs = resp.data
            resultdata.push({...v, name: rs.firstname + ' ' + rs.lastname, username: rs.username, photo: rs.photo, dateonline: rs.dateonline })
          }
          setUserContacts({ chats: [...resultdata], users: [] }); setTimeout(() => setUserContacts({ chats: [...resultdata], users: [] }), 300);
        })
        .catch(error => { setUserContacts({ chats: [], users: [] }); console.log(error) })
      }
    }
  }, [searchName, logininfo.userid]);

  const handleSelectChatContact = ({ chatid, username, name, aboutme, isonline, index }) => {
    if (chatid) {
      setSearchName('')
      navigate('/chat/' + chatid)
    } else {
      if (username) {
        setSearchName('')
        navigate('/chat/message/' + username)
      }
    }
  }

  return (<>
    <div className="chat-background"></div>
    <div className="container text-white shadow-lg">
      <div className="row vh-100">
        <div className="col-auto border-start border-top border-bottom rounded-start-4 p-0 chat-col-menu">
          <div className="container-fluid overflow-none">
            <div className="row flex-column">
              <div className="col">
                <div className="profile-info-self-container">
                  <div className="profile-info-self online">
                    <img className="img-thumbnail img-fluid" src={`http://${window.location.hostname}:${process.env.NODE_ENV === 'development' ? '3080' : window.location.port}${myUser ? myUser.photo : '/default-photo.jpg'}`} style={{width: '2.5em', height: '2.5em'}} alt="Neil Jason Canete" />
                    <div className="profile-info-name">
                      {myUser && `${myUser.firstname} ${myUser.lastname}`}
                      <span>{myUser && myUser.aboutme}</span>
                    </div>
                  </div>
                  <div className="btn-group dropend">
                    <Icons.GearFill type="button" className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" color="#8992a3de" />
                    <ul className="dropdown-menu">
                      <li className="dropdown-item">
                        <NavLink className="nav-link" to="/logout">Logout</NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="search-box mt-2 my-3">
                  <Icons.Search color="#8992a3de" />
                  <input type="search" className="form-control rounded-5" placeholder="Search" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
                </div>
              </div>
              <div className="col col-chat col-chat-contacts overflow-auto">
                <ChatContactGroup data={Object.keys(userContacts).map(key =>
                  key === "chats"
                    ? userContacts[key].map(v => Object.assign({}, { chatid: v._id.toString(), username: v.username, name: v.name, message: v.latestUpdate.message, time: new Date(v.latestUpdate.timestamp), profilephoto: `http://${window.location.hostname}:${process.env.NODE_ENV === 'development' ? '3080' : ''}${v.photo}`, isonline: (new Date(v.dateonline)).getTime() + (1000 * 60 * 10) > Date.now() }))
                    : (key === "users"
                        ? userContacts[key].map(v => Object.assign({}, { username: v.username, name: `${v.firstname} ${v.lastname}`, profilephoto: v.photo, aboutme: v.aboutme, isonline: (new Date(v.dateonline)).getTime() + (1000 * 60 * 10) > Date.now() }))
                        : [])
                  ).flat().reduce((unique, item) => unique.filter(v => v.username === item.username).length > 0 ? unique : [...unique, item], [])}
                  initialSelectedIndex={initContactIndex} onSelect={handleSelectChatContact} />
              </div>
            </div>
          </div>
        </div>
        <div className="col border-end border-top border-bottom rounded-end-4 p-0 bg-conversation">
          <Outlet />
        </div>
      </div>
    </div>
  </>)
}