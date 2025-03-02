import React, { useContext, useEffect, useState } from 'react'
import './RightSideBar.css'
import assets from '../../assets/assets'
import { logout } from '../../Config/firebase'
import { AppContext } from '../../Context/AppContext'

const RightSideBar = () => {

  const {chatUser, messages} = useContext(AppContext)
  const [msgImages, setMsgImages] = useState([])

  useEffect(() => {
    let tempvar = []
    messages.map((msg) => {
      if(msg.image){
        tempvar.push(msg.image)
      }
    })
    setMsgImages(tempvar)
  },[messages])

  return chatUser ?(
    <div className='rs'>
        <div className='rs-profile'>
            <img src={chatUser.userData.avatar} alt='' />
            <h3>{chatUser.userData.name}{Date.now()-chatUser.userData.lastSeen <= 70000 ? <img className='dot' src={assets.green_dot} alt='' /> : null}</h3>
            <p>{chatUser.userData.bio}</p>
        </div>
        <hr />
        <div className='rs-media'>
            <p>Media</p>
            <div>
                {msgImages.map((url,index)=>(<img key={index} src={url} alt='' />))}
            </div>
        </div>
        <button onClick={() => logout()}>LogOut</button>
    </div>
  ) 
  : (
    <div className='rs'>
      <button onClick={() => logout()}>Logout</button>
    </div>
  )
}

export default RightSideBar
