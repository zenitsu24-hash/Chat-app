import React, { useContext, useEffect, useState } from 'react'
import './LeftSideBar.css'
import assets from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../../Config/firebase'
import { AppContext } from '../../Context/AppContext'
import { toast } from 'react-toastify'

const LeftSideBar = () => {

  const navigate = useNavigate();
  const {userData, chatData, chatUser, setChatUser, setMessagesId, messagesId, chatVisible, setChatVisible}  = useContext(AppContext)
  const [user, setuser] = useState(null)
  const [showSearch, setShowSearch] = useState(false)

  const inputHandler = async(e) => {
    try {
      const input = e.target.value;
      if(input){
        setShowSearch(true)
        const userRef = collection(db,"users")
        const q = query(userRef,where("username","==",input.toLowerCase()));
        const querySnap = await getDocs(q)
        if(!querySnap.empty && querySnap.docs[0].data().id !== userData.id){
          let userExist = false;
          chatData.map((user) => {
            if(user.id === querySnap.docs[0].data().id){
              userExist = true
            }
          })
          if(!userExist){
            setuser(querySnap.docs[0].data());
          }
          setuser(querySnap.docs[0].data());
        }
        else{
          setuser(null)
        }
      }
      else{
        setShowSearch(false)
      }
    } catch (error) {
      
    }
  }

  const addChat = async() => {
    const messageRef = collection(db,"messages")
    const chatRef = collection(db,"chats")
    try {
      const newMessageRef = doc(messageRef)

      await setDoc(newMessageRef, {
        createAt:serverTimestamp(),
        messages:[]
      })

      await updateDoc(doc(chatRef,user.id), {
        chatsData:arrayUnion({
          messageId:newMessageRef.id,
          lastMessage:"",
          rId:userData.id,
          updatedAt:Date.now(),
          messageSeen:true
        })
      })
      await updateDoc(doc(chatRef,userData.id), {
        chatsData:arrayUnion({
          messageId:newMessageRef.id,
          lastMessage:"",
          rId:user.id,
          updatedAt:Date.now(),
          messageSeen:true
        })
      })

      const uSnap = await getDoc(doc(db,"users",user.id))
      const uData = uSnap.data();
      setChat({
        messagesId:newMessageRef.id,
        lastMessage:"",
        rId:user.id,
        updatedAt:Date.now(),
        messageSeen:true,
        userData:uData
      })
      setShowSearch(false)
      setChatVisible(true)
    } catch (error) {
      toast.error(error.message)
      console.error(error)
    }
  }

  const setChat = async(items) => {
    try {
      setMessagesId(items.messageId)
      setChatUser(items)
      setChatVisible(true);
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    const updateChatUserData = async() => {
      if(chatUser){
        const userRef = doc(db,"users",chatUser.userData.id);
        const userSnap = await getDoc(userRef)
        const userData = userSnap.data();
        setChatUser(prev=>({...prev,userData:userData}))
      }
    }
    updateChatUserData();
  },[chatData])
  
  return (
    <div className={`ls ${chatVisible ? "hidden" : ""}`}>
      <div className='ls-top'>
        <div className='ls-nav'>
            <img src={assets.logo} className='logo' alt=''/>
            <div className='menu'>
                <img src={assets.menu_icon} alt=''/>
                <div className='sub-menu'>
                    <p onClick={() => navigate('/profile')}>Edit Profile</p>
                    <hr />
                    <p>Logout</p>
                </div>
            </div>
        </div>
        <div className='ls-search'>
            <img src={assets.search_icon} alt=''/>
            <input onChange={inputHandler} type='text' placeholder='Search here...' />
        </div>
      </div>
      <div className='ls-list'>
        {showSearch && user?
         <div onClick={addChat} className='friends add-user'>
          <img src={user.avatar} alt=''/>
          <p>{user.name}</p>
         </div>:
        chatData.map((items,index)=> {
            return(
        <div key={index} onClick={() => setChat(items)} className='friends'>
            <img src={items.userData.avatar} alt='' />
            <div>
                <p>{items.userData.name}</p>
                <span>{items.lastMessage}</span>
            </div>
        </div>
            )
        })
        }
      </div>
    </div>
  )
}

export default LeftSideBar
