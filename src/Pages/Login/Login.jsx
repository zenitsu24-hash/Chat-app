import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
import { signup , login} from '../../Config/firebase'

const Login = () => {

    const [currentState, setCurrentState] = useState("Sign Up");
    const [username, setUserName] = useState()
    const [email, setEmail]= useState()
    const [password, setPassword] = useState()

    const onsubmithandler = (event) => {
         event.preventDefault();
         if(currentState==="Sign Up"){
            signup(username,email,password)
         }
         else{
            login(email,password)
         }
    }

  return (
    <div className='login'>
        <img src={assets.logo_big} alt='' />
        <form onSubmit={onsubmithandler} className='login-form'>
            <h2>{currentState}</h2>
            {currentState === "Sign Up"?<input onChange={(e)=>setUserName(e.target.value)} value={username} type='text' placeholder='Username' className='form-input' required/>: ""}
            <input onChange={(e)=>setEmail(e.target.value)} value={email} type='email' placeholder='Email Address' className='form-input' required/>
            <input onChange={(e)=>setPassword(e.target.value)} value={password} type='password' placeholder='Password' className='form-input' required/>
            <button type='submit'>{currentState === "Sign Up"? "Create an account": "Login now"}</button>
            <div className='login-term'>
                <input type='checkbox'/>
                <p>Agree to the terms of use and privacy policy</p>
            </div>
            <div className='login-forgot'>
                {
                    currentState === "Sign Up"?
                    <p className='login-toggle'>Already have an account <span onClick={() => {setCurrentState("Login")}}>Login here</span></p>:
                    <p className='login-toggle'>Create an account <span onClick={() => {setCurrentState("Sign Up")}}>Click here</span></p>
                }
            </div>
        </form>
    </div>
  )
}

export default Login