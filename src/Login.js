import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Assuming you have AuthContext defined
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdMail } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage,setErrorMessage] = useState('');
  const navigate=useNavigate();
  const { loginUser } = useAuth(); // Access setUser function from AuthContext

  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('https://xwqkcw08-8000.inc1.devtunnels.ms/', {
        email: email,
        password: password
      });
      
      if (response.data.status === 'Successful') {
        // Handle successful login, e.g., redirect to dashboard
        const userData = response.data.userData;

      // Pass user data to loginUser function
      loginUser({ id: userData.id, username: userData.username , gender:userData.gender,password:userData.password,role :userData.role,approved:userData.approved});

        
        navigate('/home');
      } else {
        setErrorMessage(response.data);
      }
    } catch (error) {
      console.error('Error during login in frontend:', error);
      // Handle error, e.g., display error message to user
    }
  };


  return (
    <div className='login-login'>
      <form className='login-form' onSubmit={handleLogin}>
        <h2>Login</h2>
        <div>
          <label className='login-heading'>Email <IoMdMail />:</label>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className='login-heading'>Password <RiLockPasswordFill />:</label>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <span className='login-error-message'>{errorMessage}</span>
        <div>
        <button className="login-btn" type="submit">Login</button>
        </div>
        <p>Don't have an account ? <Link to='/signup' className='login-signup'>Sign Up</Link></p>
        {/* <Link to='/signup' className='login-signup'>Sign Up</Link> */}
        <div>
          <Link to="/" className='login-back'><IoIosArrowBack /> Back </Link>
      </div>
      </form>
      
    </div>
  );
};

export default Login;
