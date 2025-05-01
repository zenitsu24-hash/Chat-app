import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db } from "../Config/firebase";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);
    const [messagesId, setMessagesId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatUser, setChatUser] = useState(null)
    const [chatVisible, setChatVisible] = useState(false)


    const loadUserData = async(uid) => {
        try {
            const UserRef = doc(db,"users",uid)
            const userSnap = await getDoc(UserRef)
            const userData = userSnap.data();
            setUserData(userData)
            if (userData.avatar && userData.name){
                navigate('/chat')
            }
            else{
                navigate('/profile')
            }
            await updateDoc(UserRef, {
                lastSeen: Date.now()
            })
            setInterval(async() => {
                if(chatUser){
                    await updateDoc(UserRef, {
                        lastSeen: Date.now()
                    })
                }
            }, 60000);
        } catch (error) {
            
        }
    }

    useEffect(() => {
        if(userData){
            const chatRef = doc(db,"chats",userData.id)
            const unsub = onSnapshot(chatRef, async (res) => {
                const chatDataObj = res.data();
                if (chatDataObj && chatDataObj.chatsData) {
                    const chatItems = chatDataObj.chatsData;
                    const tempData = [];
                    for (const item of chatItems) {
                        const userRef = doc(db, "users", item.rId);
                        const userSnap = await getDoc(userRef);
                        const userData = userSnap.data();
                        tempData.push({ ...item, userData });
                    }
                    setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
                } else {
                    setChatData([]);
                }
            });
            return () => {
                unsub()
            }
        }
    },[userData])
    
    const value = {
        userData, setUserData,
        chatData, setChatData,
        loadUserData,
        messages,setMessages,
        messagesId,setMessagesId,
        chatUser,setChatUser,
        chatVisible,setChatVisible
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider

