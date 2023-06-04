import { useState } from 'react'
import ChatContact from './ChatContact'

export default function ChatContactGroup({ data=[], onSelect=console.log, initialSelectedIndex=-1 }) {
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex)
  const handleClick = (e) => {
    const index = Number.parseInt(e.target.dataset.index)
    const chatid = e.target.dataset.chatid
    const name = e.target.dataset.name
    const username = e.target.dataset.username
    if (!chatid) {
      // use username instead
      setSelectedIndex(-1)
      onSelect({username, name})  
    } else {
      setSelectedIndex(index)
      onSelect({chatid, username, name, index})
    }
  }
  return (<>
    { data && data.length > 0 ?
      data.map((v, i) => <ChatContact key={`chat_contact_${i}`} data-index={i} selected={i === selectedIndex} chatid={v.chatid} username={v.username} name={v.name} time={v.time ? new Date(v.time) : undefined} message={v.message} profilephoto={v.profilephoto} aboutme={v.aboutme} online={new Date(v.online)} onClick={handleClick} {...v} />)
      : <div className="text-white d-flex justify-content-center align-items-center vh-100 h6">Search users to start chating.</div> }
  </>)
}
