import React, { useEffect, useState } from 'react'
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { GoHistory } from "react-icons/go";
import { RiVideoLine } from "react-icons/ri";
import { IoHomeOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';



function logoutUser() {
  localStorage.removeItem("userLoggedIn");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
}

const SideBar = () => {
  let userLoggenIn = localStorage.getItem("userLoggedIn");

  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    if(userLoggenIn){
      setLoggedIn(true)
    }
    else{
      setLoggedIn(false)
    }
  }, [])
  

  return (
    <>
      <div className="sideBar">
        <Link to="/" className='sideBarLink'><i><IoHomeOutline /></i> Home</Link>
        <Link to="" className='sideBarLink'><i><SiYoutubeshorts /></i> Shorts</Link>
        <Link to="" className='sideBarLink'><i><MdOutlineSubscriptions /></i> Subscription</Link>
        <Link to="" className='sideBarLink'><i><GoHistory /></i> History</Link>
        <Link to="" className='sideBarLink'><i><RiVideoLine /></i> Your Videos</Link>
        {
          loggedIn ?
        <>
        <Link className='sideBarLink' to="" onClick={logoutUser}><i><RiVideoLine /></i> Logout</Link>
        </> : <Link to="/login"><button className="LoginBtn">Login</button></Link>
        } 
      </div>
    </>
  )
}

export default SideBar