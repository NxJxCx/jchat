import './ChatContact.css'

export default function ChatContact({ chatid='', name='', time=new Date(), message='', selected=false, onClick=(e) => { console.log(chatid, e) }, ...props}) {
  return (<>
    <div className={`chat-contact${selected ? ' selected' : ''}`}>
      <img className="img-thumbnail img-fluid" src="" style={{width: '2.5em', height: '2.5em'}} />
      <div className='chat-contact-details'>
        <div className="contact-name">
          <div>{name.length > 18 ? name.substring(0, 15) + ' ..' : name}</div>
          <span>{time.getHours() > 12 ? time.getHours()-12 : time.getHours()}:{time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()} {time.getHours() > 11 ? 'am' : 'pm'}</span>
        </div>
        <div className="contact-message">{message.length > 28 ? message.substring(0, 25) + '...' :  (message.length < 28 ? message : message + '...')}</div>
      </div>
      <button type="button" className="contact-button-transparent" onClick={onClick} data-chatid={chatid} data-name={name} {...props} />
    </div>
  </>)
}
