import React, { useState } from 'react'
import './Chat.css'
import LeftSideBar from '../../Components/LeftSideBar/LeftSideBar'
import ChatBox from '../../Components/ChatBox/ChatBox'
import RightSideBar from '../../Components/RightSideBar/RightSideBar'
import { useContext } from 'react'
import { AppContext } from '../../Context/AppContext'
import { useEffect } from 'react'

const Chat = () => {

  const {chatData, userData} = useContext(AppContext);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(chatData && userData){
      setLoading(false)
    }
  },[chatData,userData])
  
  return (
    <div className='chat'>{
      loading?
      <p className='loading'>Loading...</p>:

        <div className='chat-container'>
            <LeftSideBar/>
            <ChatBox/>
            <RightSideBar/>
        </div>
    }
    </div>
  )
}

export default Chat
