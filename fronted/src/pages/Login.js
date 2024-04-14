import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link ,useNavigate} from 'react-router-dom';
import { Switch, Route } from 'react-router-dom';
import { ReactSession } from 'react-client-session';

const Login = () => {

  const navigate = useNavigate();
  ReactSession.setStoreType("localStorage");

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    validateForm();
  }

  const validateForm = () => {
    let isValid = true;

    if (email.trim() === '') {
      isValid = false;
      setEmailError('Email is required');
    } else if (!isValidEmail(email.trim())) {
      isValid = false;
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }

    if (password.trim() === '') {
      isValid = false;
      setPasswordError('Password is required');
    } else {
      setPasswordError('');
    }

    if (isValid) {

       // Call The API
       fetch(`http://127.0.0.1:8000/loginUser`, {
        mode: 'cors',
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
          email:email,
          password:password
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Result', data);
          if(data.fale == 1){
            setError(data.msg)
          }
          else{
            setSuccess(`You Are Logged In Successfully.`);
            localStorage.setItem("userLoggedIn",true);
            localStorage.setItem("userEmail",data.email);
            localStorage.setItem("userId",data.userId)
            localStorage.setItem("username",data.username)
            navigate("/")
          }
        })
        .catch((error) => console.error('Error fetching data:', error));
    }
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


  return (
    <>
    <Navbar/>
      <div className="parentDivLogin">
        <div className="loginContainer">
          <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div className="form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={emailError ? 'loginInput invalid' : email ? 'loginInput valid' : 'loginInput'}
              />
              <span className="error">{emailError}</span>
            </div>
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={passwordError ? 'loginInput invalid' : password ? 'loginInput valid' : 'loginInput'}
              />
              <span className="error">{passwordError}</span>
            </div>
            <span className='error' style={{fontSize:17}}>{error}</span>
            <span className='success'>{success}</span><br />
            <span>Don't Have An Account <Link to="/signUp" style={{color:"blue"}}>Sign Up</Link></span>
            <button type="submit" className="loginBtn my-3">Login</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login