import { NavLink } from 'react-router-dom'
import * as Icons from 'react-bootstrap-icons'
import './Chat.css'
import ChatContactGroup from '../ChatContact/ChatContactGroup'

export default function Chat() {
  return (<>
    <div className="chat-background"></div>
    <div className="container text-white shadow-lg">
      <div className="row vh-100">
        <div className="col-auto border rounded-start-4 p-0 chat-col-menu">
          <div className="container-fluid overflow-none">
            <div className="row flex-column">
              <div className="col">
                <div className="profile-info-self-container">
                  <div className="profile-info-self">
                    <img className="img-thumbnail img-fluid" src="" style={{width: '2.5em', height: '2.5em'}} />
                    <div className="profile-info-name">
                      Neil Jason
                      <span>Secretary</span>
                    </div>
                  </div>
                  <NavLink to="/">
                    <Icons.GearFill color="#8992a3de" />
                  </NavLink>
                </div>
              </div>
              <div className="col">
                <div className="search-box mt-2 my-3">
                  <Icons.Search color="#8992a3de" />
                  <input type="search" className="form-control rounded-5" placeholder="Search" />
                </div>
              </div>
              <div className="col col-chat col-chat-contacts overflow-auto">
                <ChatContactGroup data={[
                  {
                    chatid: 'af2531',
                    name: 'Charisse Mae Canete',
                    message: 'Hello my friend oh goodnessme!',
                  },
                  {
                    chatid: 'bas23r',
                    name: 'Neil Jason Canete',
                    message: 'Hello to you my friend!',
                  },
                  // {
                  //   chatid: 'bas23r',
                  //   name: 'Neil Jason Canete',
                  //   message: 'Hello to you my friend!',
                  // },
                  // {
                  //   chatid: 'bas23r',
                  //   name: 'Neil Jason Canete',
                  //   message: 'Hello to you my friend!',
                  // },
                ]} onSelect={console.log} />
              </div>
            </div>
          </div>
        </div>
        <div className="col border rounded-end-4 p-0 bg-conversation">
          <div className="container-fluid overflow-auto col-chat pt-3">
            <div className="row justify-content-between mb-3">
              <div className="col-auto">
                <div className="profile-info-self">
                  <img className="img-thumbnail img-fluid" src="" style={{width: '2.5em', height: '2.5em'}} />
                  <div className="profile-info-name">
                    Neil Jason
                    <span className="opacity-50 text-white">Secretary</span>
                  </div>
                </div>
              </div>
              <div className="col-4 d-flex justify-content-end px-4">
                <Icons.Telephone className='me-3'/>
                <Icons.PersonAdd />
              </div>
            </div>
            <div className="row conversation-container">
              <div className="col">
                Chat convo here
              </div>
            </div>
            <div className="row">
              <div className="col pt-3 d-flex justify-content-end">
                <button type="button" className="btn btn-outline-none text-white" style={{fontSize: '5mm'}}><Icons.Image /></button>
                <button type="button" className="btn btn-outline-none text-white" style={{fontSize: '5mm'}}><Icons.Images /></button>
                <textarea className="form-control w-75 mx-3 rounded-5" style={{fontSize: '10pt'}} rows={1} />
                <button type="submit" className="btn btn-outline-none text-warning me-2"><Icons.Send style={{transform: 'rotate(45deg)', fontSize: '7mm'}} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>)
}