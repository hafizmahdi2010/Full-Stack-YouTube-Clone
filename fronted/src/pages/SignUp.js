import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';


const SignUp = () => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    validateForm();
  }

  const validateForm = () => {
    let isValid = true;

    if (username.trim() === '') {
      isValid = false;
      setUsernameError('Username is required');
    } else {
      setUsernameError('');
    }

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
    } else if (password.length < 6) {
      isValid = false;
      setPasswordError('Password must be at least 6 characters');
    } else {
      setPasswordError('');
    }

    if (phone.trim() === '') {
      isValid = false;
      setPhoneError('Phone number is required');
    } else if (!isValidPhoneNumber(phone.trim())) {
      isValid = false;
      setPhoneError('Invalid phone number format');
    } else {
      setPhoneError('');
    }

    if (isValid) {
      // Call The API
      fetch(`http://127.0.0.1:8000/signUpUser`, {
        mode: 'cors',
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
          username:username,
          email:email,
          number:phone,
          password:password
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Result', data);
          if(data.fale == 1){
            setError(data.msg)
          }
        })
        .catch((error) => console.error('Error fetching data:', error));
    }
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  }


  return (
    <>
    <Navbar/>
    <div className='parentDivSignUp'>
      <div className="signUpFormcontainer">
        <form onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          <div className="form-group">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <span className="error">{usernameError}</span>
          </div>
          <div className="form-group">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <span className="error">{emailError}</span>
          </div>
          <div className="form-group">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <span className="error">{passwordError}</span>
          </div>
          <div className="form-group">
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" />
            <span className="error">{phoneError}</span>
          </div>
          <span className="error text-bg-danger" style={{color:"red"}}>{error}</span>
          <span>Already Have An Account <Link to="/login" style={{color:"blue"}}>Login</Link></span>
          <button type="submit" style={{marginTop:10}}>Sign Up</button>
        </form>
      </div>
    </div>
    </>

  )
}

export default SignUp