import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext'; // Import AuthProvider and useAuth
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMail } from "react-icons/io5";
import { IoMdMailUnread } from "react-icons/io";
import { FaPhone } from "react-icons/fa6";
import './Signup.css';
import { IoIosArrowBack } from "react-icons/io";



const Signup = () => {
  const [username,setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confrimPassword, setConfirmPassword] = useState('');
  const [phoneNumber,setPhoneNumber] = useState('');
  const [passErrorMessage, setPassErrorMessage] = useState('');
  const [confirmPassError, setConfirmPassError] = useState('');
  const [userErr,setUserErr]= useState('');
  const [phoneNumError,setPhoneNumError] = useState('');
  const [gender, setGender] = useState('Male'); 
  const { loginUser } = useAuth(); // Access loginUser from useAuth hook
  const navigate=useNavigate();


  const handleSubmit=  async (e)=>{
    e.preventDefault();
    await axios.post("https://xwqkcw08-3000.inc1.devtunnels.ms/signUp",{
      username:username,
      email: email,
      password:password,
      phone_number:phoneNumber,
      gender: gender
    }).then(res=>{
      if(res.data === "Succesful"){
        loginUser({ username, email });
        window.alert("Account created successfully");
        navigate('../')

      }
      else{
        if(res.data === "Uppercase"){
          setPassErrorMessage("Password should contain atleast one Uppercase letter. ")
        }
        else if(res.data === "Lowercase"){
          setPassErrorMessage("Password should contain atleast one Lowercase letter. ")
        }
        else if(res.data === "Number"){
          setPassErrorMessage("Password should contain atleast one Number. ")
        }
        else if(res.data === "Specialchar"){
          setPassErrorMessage("Password should contain atleast one Special Character . ")
        }
        else if(res.data === "MinLength"){
          setPassErrorMessage("Password should have atleast 7 Characters . ")
        }
        if(res.data === "Account already exists"){
          setUserErr("Email ID already exists.")
        }
      }
    })
  }
  


  return (
    <div className='signup-container'>
        <form onSubmit={handleSubmit} className='signup-form'>
        <h2 className='signup-heading'>Sign Up</h2>
          <div>
          <label className='signup-label'>Username <FaUser />:</label>
          <input type='username' placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
        </div>
        <div>
        <label className='signup-label'>Email <IoMail />:</label>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <span>{userErr}</span>
        </div>
        <div>
        <label className='signup-label'>Phone number <FaPhone />:</label>
          <input type="text" placeholder="Phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          <span>{phoneNumError}</span>
        </div>
        <div>
          <label className='signup-label'>Gender:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
        <label className='signup-label'>Password <RiLockPasswordFill />:</label>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <span>{passErrorMessage}</span>
        </div>
        <div>
        <label className='signup-label'>Confirm password <IoMdMailUnread />:</label>
          <input type="password" placeholder="Confirm Password" value={confrimPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
          <span>{confirmPassError}</span>
        </div>
          <button type="submit" className='signup-btn' >Sign Up</button>
        <div>
          <Link to="/" className='signup-back'><IoIosArrowBack /> Back </Link>
        </div>
        </form>
    </div>

  )
}

export default Signup