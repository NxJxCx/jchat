import { useState, useEffect } from 'react'
import { NavLink, useLoaderData } from 'react-router-dom'
import * as Icons from 'react-bootstrap-icons'
import './Chat.css'
import ChatContactGroup from '../ChatContact/ChatContactGroup'
import ChatConversation from '../ChatConversation/ChatConversation'
import { getUsersBySearch, getUserById, getChatSearchData, getChatData } from '../../api'

export default function Chat() {

  
  const { logininfo } = useLoaderData()
  const [myUser, setMyUser] = useState(null)
  const [userContacts, setUserContacts] = useState({})
  const [selectedConversation, setUserConversation] = useState({
    chatid: undefined,
    userid: logininfo ? logininfo.userid : undefined,
    username: undefined,
  });
  const [searchName, setSearchName] = useState('')

  useEffect(() => {
    logininfo && setUserConversation(prev => Object.assign({}, {...prev, userid: logininfo.userid }))
  }, [logininfo])

  useEffect(() => {
    if (myUser === null && selectedConversation.userid) {
      getUserById(selectedConversation.userid)
      .then(resp => new Promise(res => res(resp.data)))
      .then(setMyUser)
      .catch(error => { setMyUser(null); console.log(error) })
    }
  }, [selectedConversation, myUser])

  useEffect(() => {
    if (selectedConversation.userid) {
      if (searchName.length > 0) {
        getChatSearchData(selectedConversation.userid, searchName)
        .then(resp => new Promise(res=> res(resp.data.success)))
        .then(success=> new Promise(res=> res(setUserContacts({ chats: [...success.data], users: [] }))))
        .then(() => getUsersBySearch(searchName))
        .then(resp => new Promise(res=>res(resp.data)))
        .then(dt => setUserContacts({ users: [...dt], chats: [...userContacts.chats] }))
        .catch(error => { setUserContacts({ chats: [], users: [] }); console.log(error) })
        
      } else {
        getChatData(selectedConversation.userid)
        .then(resp => new Promise(res=> res(resp.data.success)))
        .then(success => { setUserContacts({ chats: [...success.data], users: [] }); setTimeout(() => setUserContacts({ chats: [...success.data], users: [] }), 300); })
        .catch(error => { setUserContacts({ chats: [], users: [] }); console.log(error) })
      }
    }
  }, [searchName]);

  const handleSelectChatContact = ({ chatid, username, name, index }) => {
    if (!chatid) {

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
                    <img className="img-thumbnail img-fluid" src={`http://${window.location.hostname}:${process.env.NODE_ENV === 'development' ? '3080' : window.location.port}/default-profile.jpg`} style={{width: '2.5em', height: '2.5em'}} alt="Neil Jason Canete" />
                    <div className="profile-info-name">
                      Neil Jason
                      <span>Secretary</span>
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
                    ? userContacts[key].map(v => Object.assign({}, { chatid: v._id.toString(), username: v.username, name: v.lastUpdate.sendername, message: v.lastUpdate.message, time: v.lastUpdate.timestamp, profilephoto: v.photo, online: v.dateonline }))
                    : (key === "users"
                        ? userContacts[key].map(v => Object.assign({}, { username: v.username, name: `${v.firstname} ${v.lastname}`, profilephoto: v.photo, aboutme: v.aboutme, online: v.dateonline }))
                        : [])
                  ).flat()}
                  onSelect={handleSelectChatContact} />
              </div>
            </div>
          </div>
        </div>
        <div className="col border-end border-top border-bottom rounded-end-4 p-0 bg-conversation">
          <div className="container-fluid overflow-auto col-chat pt-3">
            <div className="row justify-content-between mb-3">
              <div className="col-auto">
                <div className="profile-info-self online">
                  <img className="img-thumbnail img-fluid" src={`http://${window.location.hostname}:${process.env.NODE_ENV === 'development' ? '3080' : window.location.port}/default-profile.jpg`} style={{width: '2.5em', height: '2.5em'}} alt="Neil Jason Canete" />
                  <div className="profile-info-name">
                    Neil Jason
                    <span className="opacity-50 text-white">Secretary</span>
                  </div>
                </div>
              </div>
              <div className="col-4 d-flex justify-content-end align-items-center px-4">
                <Icons.Telephone className='me-3'/>
                <Icons.PersonAdd />
              </div>
            </div>
            <div className="chat-convo-container">
              <div className="conversation-container">
                <ChatConversation {...selectedConversation} />
              </div>
              <div className="send-message-container">
                <button type="button" className="btn btn-outline-none text-white" style={{fontSize: '5mm'}}>
                  <Icons.Images />
                </button>
                <textarea className="form-control mx-3 mt-3 rounded-4 text-white" placeholder='Type your Message...' />
                <button type="submit" className="btn btn-outline-none text-warning">
                  <Icons.Send style={{transform: 'rotate(45deg)', fontSize: '7mm'}} />
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </>)
}