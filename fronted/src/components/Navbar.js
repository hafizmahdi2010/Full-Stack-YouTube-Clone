import React, { useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { ReactSession } from 'react-client-session';
import { RiVideoLine } from "react-icons/ri";
import { SiYoutubeshorts } from "react-icons/si";
import { BsFilePost } from "react-icons/bs";

const Navbar = () => {
  const navigate = useNavigate();

  let userLoggenIn = localStorage.getItem("userLoggedIn");
  console.log(userLoggenIn)

  function searchVideos(e) {
    if (e.key === 'Enter') {
      let searchInput = document.querySelector(".searchInput");
      if (searchInput.value != "") {
        navigate(`/searchvideo?searchVal=${e.target.value}`)
      }
      else {
        console.log("You must right somthing !")
      }
    }
    else {
      console.log(e.target.value)
    }
  }

  function showDropDown(target){
    console.log("Called...")
    let dropdownTarget = document.querySelector(target);
    dropdownTarget.classList.toggle("active");
  }

  return (
    <>
      <header>
        <Link to="/"><div className="logo">
          <img
            src="https://static.vecteezy.com/system/resources/previews/023/986/473/original/youtube-logo-youtube-logo-transparent-youtube-icon-transparent-free-free-png.png"
            alt="" />
        </div></Link>
        <div className="center">
          <div className="inputBox">
            <input type="text" className='searchInput' placeholder="Search Here..." onKeyPress={searchVideos} />
            <i className="ri-search-line ic"></i>
          </div>
          <i className="ri-mic-fill"></i>
        </div>
        <div className="icons">
          {
            userLoggenIn ?
              <>
            
                <i className="ri-video-add-line" id='videoBtn' onClick={()=>showDropDown(".videoBtnDropdown")}></i>
                <div className="videoBtnDropdown">
                  <Link to="/uploadVideo"><i><RiVideoLine /></i> Upload Video</Link>
                  <Link><i><SiYoutubeshorts /></i> Upload Short</Link>
                  <Link><i><BsFilePost /></i> Upload Post</Link>
                </div>
          

                <i className="ri-notification-2-fill"></i>
                <Link to="/profile"><img src="https://yt3.googleusercontent.com/Ub8wDdhEHV3bjCLNG8zosz2EXk5Fatw-n5D8wjcn0hKV8s6_OcyjozpxyrseQouEFClafMjQ7g=s900-c-k-c0x00ffffff-no-rj" alt="" /></Link>
              </>
              : <>
                <Link to="/signUp"><button className="signUpBtn">Sign Up</button></Link>
              </>
          }
        </div>
      </header>
    </>
  )
}

export default Navbar