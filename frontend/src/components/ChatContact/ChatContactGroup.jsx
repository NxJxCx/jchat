import { useState } from 'react'
import ChatContact from './ChatContact'

export default function ChatContactGroup({ data=[], onSelect=console.log }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const handleClick = (e) => {
    const index = Number.parseInt(e.target.dataset.index)
    const chatid = e.target.dataset.chatid
    const name = e.target.dataset.name
    setSelectedIndex(index)
    onSelect(chatid, index, name)
  }
  return (<>
    { data && data.length > 0 ?
      data.map((v, i) => <ChatContact key={`chat_contact_${i}`} data-index={i} selected={i === selectedIndex} chatid={v.chatid} name={v.name} time={v.time ? new Date(v.time) : undefined} message={v.message} onClick={handleClick} />)
      : <div className="text-white d-flex justify-content-center align-items-center vh-100 h6">Search users to start chating.</div> }
  </>)
}
