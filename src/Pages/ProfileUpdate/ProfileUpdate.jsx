import React, { useContext, useEffect, useState } from 'react'
import './Profile.Update.css'
import assets from '../../assets/assets'
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../Config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import upload from '../../Lib/upload';
import { AppContext } from '../../Context/AppContext';

const ProfileUpdate = () => {

    const navigate = useNavigate();

    const [image, setImage] = useState(false);
    const [name, setname] = useState("")
    const [bio, setBio] = useState("")
    const [uid, setUid] = useState("")
    const [previmg, setPrevImg] = useState("")
    const {setUserData} = useContext(AppContext)

    const profileUpdate = async(event) => {
        event.preventDefault();
        try {
            if(!previmg && !image){
                toast.error("Upload Profile Picture")
            }
            const docRef = doc(db,"users",uid)
            if(image){
                const imageurl = await upload(image)
                setPrevImg(imageurl)
                await updateDoc(docRef, {
                    avatar:imageurl,
                    bio:bio,
                    name:name
                })
            }
            else{
                await updateDoc(docRef, {
                    bio:bio,
                    name:name
                })
            }
            const snap = await getDoc(docRef)
            setUserData(snap.data())
            navigate('/chat')
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        onAuthStateChanged(auth, async(user) => {
            if(user){
                setUid(user.uid)
                const docRef = doc(db,"users",user.uid)
                const docSnap = await getDoc(docRef)
                if(docSnap.data().name){
                    setname(docSnap.data().name);
                } 
                if(docSnap.data().bio){
                    setBio(docSnap.data().bio);
                } 
                if(docSnap.data().avatar){
                    setPrevImg(docSnap.data().avatar);
                } 
            }
            else{
                navigate('/')
            }
        })
    })

  return (
    <div className='profile'>
        <div className='profile-container'>
            <form onSubmit={profileUpdate}>
                <h3>Profile Details</h3>
                <label htmlFor='avatar'>
                    <input onChange={(e) => setImage(e.target.files[0])} type='file' id='avatar' accept='.png, .jpg, .jpeg' hidden/>
                    <img src={image? URL.createObjectURL(image):assets.avatar_icon} alt='' />
                    Upload Image Profile
                </label>
                <input onChange={(e) => setname(e.target.value)} value={name} type='text' placeholder='Your Name' required/>
                <textarea onChange={(e) => setBio(e.target.value)} value={bio} placeholder='Write Profile Bio' required></textarea>
                <button type='submit'>Save</button>
            </form>
            <img className='profile-pic' src={image? URL.createObjectURL(image) : previmg? previmg :assets.avatar_icon} alt='' />
        </div>
      
    </div>
  )
}

export default ProfileUpdate
